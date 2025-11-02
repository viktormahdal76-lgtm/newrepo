import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const ADMIN_EMAILS = ['admin@huddleme.app', 'admin@example.com'];

export const adminService = {
  isAdmin: async (email: string | null): Promise<boolean> => {
    if (!email ) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  },

  getUserStats: async () => {
   
    const profilesSnap = await getDocs(collection(db, 'profiles'));
    const profiles = profilesSnap.docs.map(d => d.data());
    
    const total = profiles.length;
    const active = profiles.filter(p => p.isOnline).length;
    const premium = profiles.filter(p => p.subscriptionTier === 'premium').length;
    const pro = profiles.filter(p => p.subscriptionTier === 'pro').length;
    const free = profiles.filter(p => !p.subscriptionTier || p.subscriptionTier === 'free').length;

    return { total, active, premium, pro, free };
  },

  getConnectionStats: async () => {
   
    const connectionsSnap = await getDocs(collection(db, 'connections'));
    const connections = connectionsSnap.docs.map(d => d.data());
    
    return {
      total: connections.length,
      active: connections.filter(c => c.status === 'accepted').length,
      pending: connections.filter(c => c.status === 'pending').length,
    };
  },

  getRevenueStats: async () => {
    // Mock revenue data - in production, integrate with Stripe
    return {
      total: 12450.00,
      monthly: 3200.00,
      weekly: 850.00,
    };
  },

  getAllUsers: async () => {
    
    const profilesSnap = await getDocs(collection(db, 'profiles'));
    return profilesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  updateUserTier: async (userId: string, tier: string) => {
    
    await updateDoc(doc(db, 'profiles', userId), { subscriptionTier: tier });
  },

  deleteUser: async (userId: string) => {
   
    await deleteDoc(doc(db, 'profiles', userId));
  },
};
