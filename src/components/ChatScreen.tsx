import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Clock } from 'lucide-react';
import { ChatConversation } from './ChatConversation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';


interface ChatPreview {
  userId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ChatScreen: React.FC = () => {
  const { connections, nearbyUsers, currentUser } = useAppContext();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);

  const acceptedConnections = connections.filter(c => c.status === 'accepted');
  
  const getUserById = (id: string) => 
    nearbyUsers.find(user => user.id === id);

  useEffect(() => {
    if (currentUser) {
      loadChatPreviews().catch(console.error);
      const cleanup = subscribeToNewMessages();
      return cleanup;
    }
  }, [currentUser, acceptedConnections]);


  const loadChatPreviews = async () => {
    if (!currentUser || !isSupabaseConfigured) return;

    try {
      const previews: ChatPreview[] = [];
      
      for (const connection of acceptedConnections) {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${connection.userId}),and(sender_id.eq.${connection.userId},receiver_id.eq.${currentUser.id})`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const lastMsg = data[0];
          
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', connection.userId)
            .eq('receiver_id', currentUser.id)
            .is('read_at', null);

          previews.push({
            userId: connection.userId,
            lastMessage: lastMsg.content,
            lastMessageTime: lastMsg.created_at,
            unreadCount: count || 0
          });
        }
      }

      setChatPreviews(previews);
    } catch (err) {
      console.error('Error loading chat previews:', err);
    }
  };

  const subscribeToNewMessages = () => {
    if (!currentUser || !isSupabaseConfigured) return () => {};

    const channel = supabase
      .channel('new-messages')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        () => {
          loadChatPreviews();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };


  const getChatPreview = (userId: string) => {
    return chatPreviews.find(cp => cp.userId === userId);
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };


  if (selectedChat && currentUser) {
    const user = getUserById(selectedChat);
    if (user) {
      return (
        <ChatConversation
          userId={selectedChat}
          userName={user.name}
          userAvatar={user.avatar}
          currentUserId={currentUser.id}
          onBack={() => setSelectedChat(null)}
        />
      );
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {acceptedConnections.length}
        </Badge>
      </div>

      <div className="flex-1">
        {acceptedConnections.length > 0 ? (
          <div className="space-y-3">
            {acceptedConnections.map((connection) => {
              const user = getUserById(connection.userId);
              if (!user) return null;

              const preview = getChatPreview(connection.userId);

              return (
                <Card 
                  key={connection.id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedChat(connection.userId)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-800">{user.name}</h4>
                        {preview && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(preview.lastMessageTime)}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {preview?.lastMessage || 'Start a conversation...'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{user.distance}m away</span>
                        {preview && preview.unreadCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {preview.unreadCount} new
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No chats yet</h3>
            <p className="text-gray-500 mb-4">
              Connect with people nearby to start chatting
            </p>
            <div className="text-sm text-gray-400">
              💡 Tip: Accept connection requests to enable messaging
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
