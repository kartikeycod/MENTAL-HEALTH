import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const getUserDoc = async (uid) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getLegacyUserDoc = async (uid) => {
  const userRef = doc(db, COLLECTIONS.LEGACY_USERS, uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const saveUserPlanSelection = async (uid, plan) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(userRef);

  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 28);

  const payload = {
    plan,
    course: {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      currentDay: 1,
      progressPct: 0,
      testMode: "daily",
      status: "active",
      updatedAt: serverTimestamp(),
    },
    schedule:
      snap.exists() && snap.data().schedule
        ? snap.data().schedule
        : { exercise: null, meals: null, testMode: "daily" },
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(userRef, payload, { merge: true });
};
