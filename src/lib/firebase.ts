
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// IMPORTANT: 
// Create a file named .env.local in the root of your project
// and add your Firebase project's configuration there.
// Example .env.local file:
// NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
// NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
// NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef..."
// NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-..."

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Check if the essential Firebase config is provided
const isFirebaseConfigProvided = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId;

if (isFirebaseConfigProvided) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // If config is not provided, we cannot initialize Firebase.
    // To prevent the app from crashing, we'll export dummy objects.
    // The app will not have Firebase functionality.
    console.warn(
        "Firebase configuration is missing or incomplete in your .env.local file. " +
        "Firebase features will be disabled. Please check src/lib/firebase.ts for required variables."
    );
    app = null as any; // Using any to satisfy the type system for the dummy export
    auth = null as any;
    db = null as any;
}


export { app, auth, db };
