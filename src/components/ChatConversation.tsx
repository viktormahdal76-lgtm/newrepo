import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { syncService } from '@/lib/sync-service';
import { useToast } from '@/hooks/use-toast';


interface Message {

  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface ChatConversationProps {
  userId: string;
  userName: string;
  userAvatar: string;
  currentUserId: string;
  onBack: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  userId,
  userName,
  userAvatar,
  currentUserId,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages().catch(console.error);
    const msgChannel = subscribeToMessages();
    const typingChannel = subscribeToTyping();
    markMessagesAsRead().catch(console.error);

    return () => {
      msgChannel?.unsubscribe();
      typingChannel?.unsubscribe();
    };
  }, [userId, currentUserId]);


  const loadMessages = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const subscribeToMessages = () => {
    if (!isSupabaseConfigured) return undefined;
    
    const channel = supabase
      .channel(`messages:${userId}:${currentUserId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`
        }, 
        (payload) => {
          if (payload.new.sender_id === userId) {
            setMessages(prev => [...prev, payload.new as Message]);
            markMessageAsRead(payload.new.id);
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(prev => prev.map(msg => 
            msg.id === payload.new.id ? payload.new as Message : msg
          ));
        }
      )
      .subscribe();

    return channel;
  };

  const subscribeToTyping = () => {
    if (!isSupabaseConfigured) return undefined;
    
    const channel = supabase
      .channel(`typing:${userId}:${currentUserId}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId === userId) {
          setIsTyping(true);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        }
      })
      .subscribe();

    return channel;
  };

  const sendTypingIndicator = () => {
    if (!isSupabaseConfigured) return;
    
    supabase.channel(`typing:${currentUserId}:${userId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId }
      });
  };

  const markMessagesAsRead = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', userId)
        .eq('receiver_id', currentUserId)
        .is('read_at', null);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    if (!isSupabaseConfigured) return;
    
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const messageData = {
      sender_id: currentUserId,
      receiver_id: userId,
      content: newMessage.trim()
    };

    setIsSending(true);
    const tempMessage = newMessage;
    setNewMessage('');

    try {
      if (!navigator.onLine || !isSupabaseConfigured) {
        // Queue for background sync
        syncService.addAction('message', 'create', messageData);
        // Add optimistic message
        const optimisticMsg: Message = {
          id: `temp_${Date.now()}`,
          ...messageData,
          created_at: new Date().toISOString(),
          read_at: null
        };
        setMessages(prev => [...prev, optimisticMsg]);
      } else {
        const { error } = await supabase
          .from('messages')
          .insert(messageData);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessage(tempMessage);
      syncService.addAction('message', 'create', messageData);
    } finally {
      setIsSending(false);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    sendTypingIndicator();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{userName}</h3>
          {isTyping && <p className="text-xs text-gray-500">typing...</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isSender = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                isSender ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <span className={`text-xs ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isSender && (
                    msg.read_at ? 
                      <CheckCheck className="w-3 h-3 text-blue-100" /> : 
                      <Check className="w-3 h-3 text-blue-100" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
