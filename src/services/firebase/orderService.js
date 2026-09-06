import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const createDemoOrder = async ({
  patientUid,
  patientName,
  doctorUid,
  doctorName,
  planId,
  planTitle,
  amount,
  currency = "INR",
}) => {
  if (!patientUid || !doctorUid || !planId) {
    throw new Error("Missing required order parameters.");
  }

  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const payload = {
    patientUid,
    patientName: patientName || "Patient",
    doctorUid,
    doctorName: doctorName || "Therapist",
    planId,
    planTitle: planTitle || "Consultation Plan",
    amount: Number(amount) || 0,
    currency,
    status: "completed",
    paymentMode: "demo",
    isDemo: true,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(ordersRef, payload);
  return { id: docRef.id, ...payload };
};

export const getPatientOrders = async (patientUid) => {
  if (!patientUid) return [];
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const q = query(ordersRef, where("patientUid", "==", patientUid));
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return orders.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

export const getDoctorOrders = async (doctorUid) => {
  if (!doctorUid) return [];
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const q = query(ordersRef, where("doctorUid", "==", doctorUid));
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return orders.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

export const getAllOrders = async () => {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const snap = await getDocs(ordersRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const checkPatientPurchasedDoctor = async (patientUid, doctorUid) => {
  if (!patientUid || !doctorUid) return false;
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const q = query(
    ordersRef,
    where("patientUid", "==", patientUid),
    where("doctorUid", "==", doctorUid),
    where("status", "==", "completed")
  );
  const snap = await getDocs(q);
  return !snap.empty;
};
