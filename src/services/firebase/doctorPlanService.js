import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const getPlansByDoctorUid = async (doctorUid) => {
  if (!doctorUid) return [];
  const plansRef = collection(db, COLLECTIONS.DOCTOR_PLANS);
  const q = query(plansRef, where("doctorUid", "==", doctorUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createDoctorPlan = async (doctorUid, planData) => {
  const plansRef = collection(db, COLLECTIONS.DOCTOR_PLANS);
  const payload = {
    doctorUid,
    name: planData.name,
    description: planData.description || "",
    duration: planData.duration || "1 Month",
    price: Number(planData.price) || 0,
    currency: planData.currency || "INR",
    sessionsCount: Number(planData.sessionsCount) || 1,
    features: planData.features || [],
    active: planData.active !== undefined ? planData.active : true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(plansRef, payload);
  return { id: docRef.id, ...payload };
};

export const updateDoctorPlan = async (planId, updates) => {
  const planRef = doc(db, COLLECTIONS.DOCTOR_PLANS, planId);
  await updateDoc(planRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDoctorPlan = async (planId) => {
  const planRef = doc(db, COLLECTIONS.DOCTOR_PLANS, planId);
  await deleteDoc(planRef);
};
