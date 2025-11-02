import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, query, where, onSnapshot, serverTimestamp, or } from 'firebase/firestore';
import { Meetup, Venue } from '@/types';

export class MeetupService {
  async proposeMeetup(
    proposerId: string,
    recipientId: string,
    venue: Venue,
    proposedTime: Date,
    message: string
  ) {
    const meetupRef = collection(db, 'meetups');
    await addDoc(meetupRef, {
      proposerId,
      recipientId,
      venue,
      proposedTime,
      message,
      status: 'pending',
      createdAt: serverTimestamp()
    });
  }

  async acceptMeetup(meetupId: string) {
    const meetupRef = doc(db, 'meetups', meetupId);
    await updateDoc(meetupRef, {
      status: 'accepted',
      acceptedAt: serverTimestamp()
    });
  }

  async declineMeetup(meetupId: string) {
    const meetupRef = doc(db, 'meetups', meetupId);
    await updateDoc(meetupRef, {
      status: 'declined',
      declinedAt: serverTimestamp()
    });
  }

  subscribeToMeetups(userId: string, callback: (meetups: Meetup[]) => void) {
    const q = query(
      collection(db, 'meetups'),
      or(
        where('proposerId', '==', userId),
        where('recipientId', '==', userId)
      )
    );
    
    return onSnapshot(q, (snapshot) => {
      const meetups = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          proposerId: data.proposerId,
          recipientId: data.recipientId,
          venue: data.venue,
          proposedTime: data.proposedTime?.toDate() || new Date(),
          message: data.message,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Meetup;
      });
      callback(meetups);
    });
  }
}

export const meetupService = new MeetupService();
