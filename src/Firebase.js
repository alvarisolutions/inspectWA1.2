// Firebase.js

// Import the necessary functions from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyCRZuD0ll6hxlHTDZiFwX87UfiT_fuuDX0",
    authDomain: "inspectwa-422d3.firebaseapp.com",
    databaseURL: "https://inspectwa-422d3.firebaseio.com",
    projectId: "inspectwa-422d3",
    storageBucket: "inspectwa-422d3.appspot.com",
    messagingSenderId: "279008653722",
    appId: "1:279008653722:web:c4bdecafd8ebc4000e0a23",
    measurementId: "G-F3BZWHWREM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Export the database for use in other files
export { database };
