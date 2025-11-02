# Backend Integration Setup Guide

## Firebase Firestore Database Schema

The app now uses real Firebase backend instead of mock BLE service. Create these collections in your Firebase Firestore:

### Collections

#### 1. profiles
```javascript
{
  firebaseUid: string,
  fullName: string,
  email: string,
  avatarUrl: string,
  bio: string,
  age: number,
  gender: string,
  interests: string[],
  onboardingCompleted: boolean,
  isOnline: boolean,
  lastSeen: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. connections
```javascript
{
  fromUserId: string,
  toUserId: string,
  status: 'pending' | 'accepted' | 'declined',
  createdAt: timestamp,
  acceptedAt: timestamp (optional)
}
```

#### 3. messages
```javascript
{
  senderId: string,
  receiverId: string,
  content: string,
  read: boolean,
  createdAt: timestamp
}
```

#### 4. meetups
```javascript
{
  proposerId: string,
  recipientId: string,
  venue: object,
  proposedTime: timestamp,
  message: string,
  status: 'pending' | 'accepted' | 'declined',
  createdAt: timestamp
}
```

## Features Implemented

✅ Real Firebase Authentication (replaces mock auth)
✅ User profile storage in Firestore
✅ Real-time connection requests
✅ Real-time chat messages with persistence
✅ Real-time meetup proposals
✅ Online/offline status tracking
✅ Automatic data synchronization

## How It Works

- **Authentication**: Firebase Auth with email/password
- **User Discovery**: Real-time query of online users
- **Connections**: Persistent connection requests with status
- **Messages**: Real-time chat with Firestore listeners
- **Meetups**: Proposal system with venue and time data
