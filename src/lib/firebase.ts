import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your Firebase configuration is now loaded from the secrets you just entered
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// We create placeholder variables
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This is the "lazy initialization" function that prevents crashes
function initializeFirebase() {
  // This "if" statement ensures the code only runs ONCE
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("Firebase initialized successfully!");
    } catch (error) {
      console.error('Firebase initialization error!', error);
    }
  }
}

// We call the function once to get everything ready
initializeFirebase();

// We export the initialized services for the rest of the app to use
export { auth, db, app };