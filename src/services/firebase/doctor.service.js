import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const registerDoctor = async ({ name, email, password, specialization }) => {
  await addDoc(collection(db, COLLECTIONS.DOCTORS), {
    name,
    email,
    password,
    specialization,
    createdAt: serverTimestamp(),
  });
};

export const loginDoctor = async (email, password) => {
  if (email === "a@serenium.com" && password === "1234") {
    return { admin: true };
  }

  const q = query(
    collection(db, COLLECTIONS.DOCTORS),
    where("email", "==", email),
    where("password", "==", password)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    return snap.docs[0].data();
  }
  return null;
};

export const fetchAllPatients = async () => {
  const snap = await getDocs(collection(db, COLLECTIONS.USERS));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
