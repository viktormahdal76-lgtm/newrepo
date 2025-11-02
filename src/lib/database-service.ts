import { db } from '@/lib/firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, onSnapshot, orderBy, Timestamp, addDoc, serverTimestamp
} from 'firebase/firestore';
import { User, Connection, Message, Meetup, Venue } from '@/types';

export class DatabaseService {
  // User Profile Operations
  async createProfile(userId: string, profileData: Partial<User>) {
    const profileRef = doc(db, 'profiles', userId);
    await setDoc(profileRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isOnline: true,
      lastSeen: serverTimestamp()
    });
  }

  async updateProfile(userId: string, updates: Partial<User>) {
    const profileRef = doc(db, 'profiles', userId);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  async getProfile(userId: string): Promise<User | null> {
    const profileRef = doc(db, 'profiles', userId);
    const snap = await getDoc(profileRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as User;
  }

  subscribeToProfile(userId: string, callback: (user: User | null) => void) {
    const profileRef = doc(db, 'profiles', userId);
    return onSnapshot(profileRef, (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } as User : null);
    });
  }

  async getNearbyUsers(limit = 50): Promise<User[]> {
    const q = query(collection(db, 'profiles'), where('isOnline', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  subscribeToNearbyUsers(callback: (users: User[]) => void) {
    const q = query(collection(db, 'profiles'), where('isOnline', '==', true));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      callback(users);
    });
  }
