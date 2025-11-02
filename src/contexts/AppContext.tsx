import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { User, Connection, Message, Chat, AppScreen, Meetup, Venue } from '@/types';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, or } from 'firebase/firestore';
import { connectionService } from '@/lib/database-connections';
import { messageService } from '@/lib/database-messages';
import { meetupService } from '@/lib/database-meetups';
import { locationService, LocationCoordinates, LocationPermissionStatus } from '@/lib/location-service';


interface AppContextType {
  currentUser: User | null;
  authUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  nearbyUsers: User[];
  connections: Connection[];
  chats: Chat[];
  messages: Message[];
  meetups: Meetup[];
  currentScreen: AppScreen;
  isScanning: boolean;
  scanRadius: number;
  locationPermission: LocationPermissionStatus;
  userLocation: LocationCoordinates | null;
  showLocationModal: boolean;
  setCurrentScreen: (screen: AppScreen) => void;
  sendConnectionRequest: (userId: string) => void;
  acceptConnection: (connectionId: string) => void;
  declineConnection: (connectionId: string) => void;
  sendMessage: (chatId: string, content: string) => void;
  proposeMeetup: (recipientId: string, venue: Venue, time: Date, message: string) => void;
  acceptMeetup: (meetupId: string) => void;
  declineMeetup: (meetupId: string) => void;
  startScanning: () => void;
  stopScanning: () => void;
  setScanRadius: (radius: number) => void;
  requestLocationPermission: () => Promise<void>;
  closeLocationModal: () => void;
  logout: () => void;
  setDemoMode: () => void;
}



const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('radar');
  const [isScanning, setIsScanning] = useState(false);
  const [scanRadius] = useState(100);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus>('prompt');
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Check location permission on mount and when user authenticates
  useEffect(() => {
    const initLocationPermission = async () => {
      // Small delay to ensure authentication is fully set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const status = await locationService.checkPermission();
      console.log('Location permission status:', status);
      setLocationPermission(status);
      
      // Show modal if permission is needed and user is authenticated
      if (status === 'prompt') {
        console.log('Showing location modal');
        setShowLocationModal(true);
      }
    };
    
    if (isAuthenticated) {
      console.log('User authenticated, checking location permission');
      initLocationPermission();
    }
  }, [isAuthenticated]);





  // Auth listener
  useEffect(() => {
   {
      setIsAuthenticated(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setIsAuthenticated(!!user);
      if (user) {
        await loadUserProfile(user.uid);
        await updateDoc(doc(db, 'profiles', user.uid), { isOnline: true, lastSeen: new Date() });
      } else {
        setIsOnboarded(false);
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const docSnap = await getDoc(doc(db, 'profiles', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.onboardingCompleted) {
        setIsOnboarded(true);
        setCurrentUser({
          id: userId,
          name: data.fullName || 'User',
          avatar: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
          bio: data.bio || '',
          interests: data.interests || [],
          distance: 0,
          lastSeen: new Date(),
          isOnline: true,
          age: data.age || 0,
          gender: data.gender || 'prefer-not-to-say',
        });
      }
    }
  };

  // Real-time listeners
  useEffect(() => {
    if (!currentUser ) return;
    const unsubscribers: (() => void)[] = [];
    
    // Listen to connections
    const connUnsub = connectionService.subscribeToConnections(currentUser.id, setConnections);
    unsubscribers.push(connUnsub);
    
    // Listen to messages
    const msgUnsub = messageService.subscribeToAllUserMessages(currentUser.id, setMessages);
    unsubscribers.push(msgUnsub);
    
    // Listen to meetups
    const meetupUnsub = meetupService.subscribeToMeetups(currentUser.id, setMeetups);
    unsubscribers.push(meetupUnsub);
    
    return () => unsubscribers.forEach(unsub => unsub());
  }, [currentUser]);

  // Nearby users listener
  useEffect(() => {
    if (!isScanning ) return;
    const q = query(collection(db, 'profiles'), where('isOnline', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as User))
        .filter(u => u.id !== currentUser?.id);
      setNearbyUsers(users);
    });
    return () => unsubscribe();
  }, [isScanning, currentUser]);

  const sendConnectionRequest = async (userId: string) => {
    if (!currentUser) return;
    await connectionService.sendConnectionRequest(currentUser.id, userId);
    toast({ title: 'Connection request sent!' });
  };

  const acceptConnection = async (connectionId: string) => {
    await connectionService.acceptConnection(connectionId);
    toast({ title: 'Connection accepted!' });
  };

  const declineConnection = async (connectionId: string) => {
    await connectionService.declineConnection(connectionId);
  };

  const sendMessage = async (chatId: string, content: string) => {
    if (!currentUser) return;
    await messageService.sendMessage(currentUser.id, chatId, content);
  };

  const proposeMeetup = async (recipientId: string, venue: Venue, time: Date, message: string) => {
    if (!currentUser) return;
    await meetupService.proposeMeetup(currentUser.id, recipientId, venue, time, message);
    toast({ title: 'Meetup proposal sent!' });
  };

  const acceptMeetup = async (meetupId: string) => {
    await meetupService.acceptMeetup(meetupId);
    toast({ title: 'Meetup accepted!' });
  };


  const declineMeetup = async (meetupId: string) => {
    await meetupService.declineMeetup(meetupId);
  };


  const requestLocationPermission = async () => {
    const status = await locationService.requestPermission();
    setLocationPermission(status);
    
    if (status === 'granted') {
      locationService.startTracking((location) => {
        setUserLocation(location);
        // Update user location in Firebase if authenticated
        if (currentUser ) {
          updateDoc(doc(db, 'profiles', currentUser.id), {
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
              lastUpdated: new Date(location.timestamp)
            }
          }).catch(console.error);
        }
      });
      toast({ title: 'Location access granted', description: 'Now scanning for nearby users' });
    } else {
      toast({ 
        title: 'Location access denied', 
        description: 'Enable location to find nearby users',
        variant: 'destructive'
      });
    }
  };

  const logout = async () => {
    locationService.stopTracking();
    if (currentUser ) {
      await updateDoc(doc(db, 'profiles', currentUser.id), { isOnline: false });
      await auth.signOut();
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsOnboarded(false);
  };

  const setDemoMode = () => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
    setCurrentUser({
      id: 'demo-user',
      name: 'Demo User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      bio: 'Exploring the app in demo mode',
      interests: ['Tech', 'Travel', 'Music'],
      distance: 0,
      lastSeen: new Date(),
      isOnline: true,
      age: 28,
      gender: 'prefer-not-to-say',
    });
  };



  return (
    <AppContext.Provider value={{
      currentUser, authUser, isAuthenticated, isOnboarded, nearbyUsers,
      connections, chats: [], messages, meetups, currentScreen, isScanning,
      scanRadius, locationPermission, userLocation, showLocationModal, setCurrentScreen, 
      sendConnectionRequest, acceptConnection, declineConnection, sendMessage, 
      proposeMeetup, acceptMeetup, declineMeetup,
      startScanning: () => setIsScanning(true), stopScanning: () => setIsScanning(false),
      setScanRadius: () => {}, requestLocationPermission, 
      closeLocationModal: () => setShowLocationModal(false),
      logout, setDemoMode
    }}>
      {children}
    </AppContext.Provider>
  );
};
