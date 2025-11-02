import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, serverTimestamp, or } from 'firebase/firestore';
import { Connection } from '@/types';

export class ConnectionService {
  async sendConnectionRequest(fromUserId: string, toUserId: string) {
    const connRef = collection(db, 'connections');
    await addDoc(connRef, {
      fromUserId,
      toUserId,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  }

  async acceptConnection(connectionId: string) {
    const connRef = doc(db, 'connections', connectionId);
    await updateDoc(connRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp()
    });
  }

  async declineConnection(connectionId: string) {
    const connRef = doc(db, 'connections', connectionId);
    await updateDoc(connRef, {
      status: 'declined',
      declinedAt: serverTimestamp()
    });
  }

  subscribeToConnections(userId: string, callback: (connections: any[]) => void) {
    const q = query(
      collection(db, 'connections'),
      or(
        where('fromUserId', '==', userId),
        where('toUserId', '==', userId)
      )
    );
    return onSnapshot(q, (snapshot) => {
      const connections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(connections);
    });
  }
}

export const connectionService = new ConnectionService();
