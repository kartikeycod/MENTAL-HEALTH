// ✅ Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7DJflr2Fm7fKW2EcTsDCVV1RQ2ctDpf8",
  authDomain: "relief-13dee.firebaseapp.com",
  projectId: "relief-13dee",
  storageBucket: "relief-13dee.appspot.com", // ✅ fixed URL (was incorrect)
  messagingSenderId: "1011363331833",
  appId: "1:1011363331833:web:16c1af8a42b0f128e8ec28",
  measurementId: "G-ZY65RDL9NS"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication
const auth = getAuth(app);

// ✅ Initialize Firestore
const db = getFirestore(app);

// ✅ Export for use throughout your app
export { app, auth, db };
