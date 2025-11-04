import React, { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { scanForDevices, NearbyUser } from './lib/ble-scanner';
import './App.css';

// This component handles creating a new user profile
const CreateProfile = ({ onProfileCreated }: { onProfileCreated: (user: User) => void }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      setError('Please enter a name.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      const userProfile = {
        uid: user.uid,
        name: name,
        color: color,
        lastSeen: new Date(),
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
      onProfileCreated(user);
    } catch (err) {
      console.error("Error creating profile:", err);
      setError('Could not create profile. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Welcome to HuddleMe</h1>
      <p>Create a temporary profile to find others nearby.</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="profile-input"
      />
      <div className="color-picker">
        <label htmlFor="color">Choose your color:</label>
        <input
          type="color"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="profile-color-input"
        />
      </div>
      <button onClick={handleCreateProfile} disabled={isLoading} className="profile-button">
        {isLoading ? 'Creating...' : 'Start Huddling'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

// This component shows the main scanning screen
const ScanningScreen = ({ user, nearbyUsers }: { user: User, nearbyUsers: NearbyUser[] }) => {
  return (
    <div className="scanning-container">
      <div className="header">
        <h2>Looking for others...</h2>
        <p>Your UID: {user.uid}</p>
      </div>
      <div className="user-list">
        {nearbyUsers.length > 0 ? (
          nearbyUsers.map(device => (
            <div key={device.uid} className="user-card" style={{ borderTopColor: device.color }}>
              <h3>{device.name}</h3>
            </div>
          ))
        ) : (
          <p className="no-users-found">No one nearby yet. Make sure they have HuddleMe open!</p>
        )}
      </div>
    </div>
  );
};


// The main App component that decides what to show
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);

  // This effect checks if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify user has a profile document in Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(currentUser);
        } else {
          // User exists in Auth but not Firestore, force re-creation
          await currentUser.delete(); // Clean up broken auth entry
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // This effect handles the Bluetooth scanning logic
  useEffect(() => {
    // Only start scanning if we have a valid user
    if (user) {
      console.log("User found, starting BLE scan...");
      const stopScan = scanForDevices(user.uid, (devices) => {
        setNearbyUsers(devices);
      });

      // This function will be called when the component unmounts
      return () => {
        console.log("Stopping BLE scan.");
        stopScan();
      };
    }
  }, [user]); // This effect re-runs whenever the 'user' state changes

  // Render loading screen
  if (isLoading) {
    return <div className="loading-screen"><h1>HuddleMe</h1><p>Loading...</p></div>;
  }

  // Decide which component to render
  return (
    <div className="App">
      {user ? (
        <ScanningScreen user={user} nearbyUsers={nearbyUsers} />
      ) : (
        <CreateProfile onProfileCreated={setUser} />
      )}
    </div>
  );
}

export default App;