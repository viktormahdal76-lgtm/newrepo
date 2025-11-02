import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Message } from '@/types';

export class MessageService {
  async sendMessage(fromUserId: string, toUserId: string, content: string) {
    const msgRef = collection(db, 'messages');
    await addDoc(msgRef, {
      senderId: fromUserId,
      receiverId: toUserId,
      content,
      read: false,
      createdAt: serverTimestamp()
    });
  }

  async markAsRead(messageId: string) {
    const msgRef = doc(db, 'messages', messageId);
    await updateDoc(msgRef, { read: true });
  }

  subscribeToMessages(userId: string, otherUserId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [userId, otherUserId]),
      where('receiverId', 'in', [userId, otherUserId]),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          read: data.read,
          timestamp: data.createdAt?.toDate() || new Date()
        } as Message;
      });
      callback(messages);
    });
  }

  subscribeToAllUserMessages(userId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content,
            read: data.read,
            timestamp: data.createdAt?.toDate() || new Date()
          } as Message;
        })
        .filter(m => m.senderId === userId || m.receiverId === userId);
      callback(messages);
    });
  }
}

export const messageService = new MessageService();
