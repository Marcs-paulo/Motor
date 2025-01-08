import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase config object (to be replaced by the user with their Firebase project details)
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_AUTH_DOMAIN_HERE',
  databaseURL: 'YOUR_DATABASE_URL_HERE',
  projectId: 'YOUR_PROJECT_ID_HERE',
  storageBucket: 'YOUR_STORAGE_BUCKET_HERE',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID_HERE',
  appId: 'YOUR_APP_ID_HERE'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the database
const db = getDatabase(app);

// Exporting the necessary services
export { db };
