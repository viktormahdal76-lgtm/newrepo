export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  interests: string[];
  distance: number;
  lastSeen: Date;
  isOnline: boolean;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  location: string;
  occupation?: string;
}

export interface Connection {
  id: string;
  userId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}


export interface Venue {
  id: string;
  name: string;
  type: 'coffee' | 'restaurant' | 'park' | 'bar' | 'cafe' | 'other';
  address: string;
  distance: number;
  rating: number;
  image: string;
  coordinates: { lat: number; lng: number };
}

export interface Meetup {
  id: string;
  proposerId: string;
  recipientId: string;
  venue: Venue;
  proposedTime: Date;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message?: string;
  createdAt: Date;
}

export type AppScreen = 'radar' | 'connections' | 'chat' | 'profile' | 'settings' | 'faq' | 'about' | 'terms' | 'pricing' | 'meetups' | 'privacy';