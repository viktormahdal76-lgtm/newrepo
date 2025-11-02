import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

let messaging: any = null;

// Initialize FCM
export const initializeMessaging = () => {
  try {
    messaging = getMessaging(app);
    return messaging;
  } catch (error) {
    console.error('FCM not supported:', error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async (userId: string): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      if (!messaging) {
        messaging = initializeMessaging();
      }
      
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // Add this to Firebase console
      });
      
      // Save token to user profile
      if (token && userId) {
        await updateDoc(doc(db, 'users', userId), {
          fcmToken: token,
          notificationsEnabled: true
        });
      }
      
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) {
    messaging = initializeMessaging();
  }
  
  if (messaging) {
    return onMessage(messaging, callback);
  }
};

// Show notification
export const showNotification = (title: string, body: string, icon?: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/icon.png',
      badge: '/badge.png'
    });
  }
};
