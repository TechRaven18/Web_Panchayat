import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDIgBHL-r3sQS9f-hZjXGnH30B9hSgWje4",
  authDomain: "panchayat-system.firebaseapp.com",
  projectId: "panchayat-system",
  storageBucket: "panchayat-system.firebasestorage.app",
  messagingSenderId: "461948076927",
  appId: "1:461948076927:web:0443447024f62dad16504a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
export default app;