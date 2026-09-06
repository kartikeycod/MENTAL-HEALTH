import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const sendNotification = async (recipientUid, type, title, message) => {
  if (!recipientUid) return;
  const notifRef = collection(db, COLLECTIONS.NOTIFICATIONS);
  await addDoc(notifRef, {
    recipientUid,
    type: type || "info",
    title,
    message,
    read: false,
    timestamp: serverTimestamp(),
  });
};

export const getUserNotifications = async (recipientUid) => {
  if (!recipientUid) return [];
  const notifRef = collection(db, COLLECTIONS.NOTIFICATIONS);
  const q = query(notifRef, where("recipientUid", "==", recipientUid));
  const snap = await getDocs(q);
  const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return notifs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
};

export const markNotificationAsRead = async (notificationId) => {
  const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
  await updateDoc(ref, { read: true });
};
