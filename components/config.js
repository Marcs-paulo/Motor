import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase config object
const firebaseConfig = {
  apiKey: 'AIzaSyCsmw72rxaVin42Ufln-Cage7LimVWaHuU',
  authDomain: 'casasmart-ea97c.firebaseapp.com',
  databaseURL: 'https://casasmart-ea97c-default-rtdb.firebaseio.com',
  projectId: 'casasmart-ea97c',
  storageBucket: 'casasmart-ea97c.firebasestorage.app',
  messagingSenderId: '1072350976846',
  appId: '1:1072350976846:android:d2d827d94f19ae22e7dc1f'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the database
const db = getDatabase(app);

// Exporting the necessary services
export { db };