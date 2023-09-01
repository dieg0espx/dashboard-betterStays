// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFC0dwnbeqz_vCLUIv6yg3piDwFXwAvm0",
  authDomain: "betterstays-71a09.firebaseapp.com",
  projectId: "betterstays-71a09",
  storageBucket: "betterstays-71a09.appspot.com",
  messagingSenderId: "1055920424862",
  appId: "1:1055920424862:web:ced65ad7686ade7775388f"
};



// Initialize Firebaseå
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();