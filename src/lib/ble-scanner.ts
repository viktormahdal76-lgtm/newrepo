import { db } from './firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, Timestamp } from 'firebase/firestore';

export interface NearbyUser {
  uid: string;
  name: string;
  color: string;
  lastSeen: Date;
}

export function scanForDevices(
  currentUserUid: string,
  onDevicesFound: (devices: NearbyUser[]) => void
): () => void {
  const usersRef = collection(db, 'users');
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  const q = query(
    usersRef,
    where('lastSeen', '>', Timestamp.fromDate(fiveMinutesAgo))
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const nearbyUsers: NearbyUser[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (doc.id !== currentUserUid) {
        nearbyUsers.push({
          uid: doc.id,
          name: data.name || 'Unknown',
          color: data.color || '#000000',
          lastSeen: data.lastSeen?.toDate() || new Date(),
        });
      }
    });
    onDevicesFound(nearbyUsers);
  });

  const heartbeatInterval = setInterval(async () => {
    try {
      await updateDoc(doc(db, 'users', currentUserUid), {
        lastSeen: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error updating lastSeen:', error);
    }
  }, 30000);

  return () => {
    unsubscribe();
    clearInterval(heartbeatInterval);
  };
}
