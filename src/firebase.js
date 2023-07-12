// Imports
import {getAuth} from 'firebase/auth';
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID} from '@env';





// Config
const firebaseConfig = {
  apiKey:API_KEY,
  authDomain:AUTH_DOMAIN,
  projectId:PROJECT_ID,
  storageBucket:STORAGE_BUCKET,
  messagingSenderId:MESSAGING_SENDER_ID,
  appId:APP_ID,
  measurementId:MEASUREMENT_ID
};





// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();