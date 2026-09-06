import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";
import { APPLICATION_STATUS, PUBLIC_STATUS } from "../../config/statuses";

export const submitDoctorApplication = async (doctorUid, submittedInfo, documentMetadataList) => {
  const appId = `app_${doctorUid}`;
  const appRef = doc(db, COLLECTIONS.DOCTOR_APPLICATIONS, appId);

  const payload = {
    id: appId,
    doctorUid,
    submittedInfo,
    documents: documentMetadataList || [],
    status: APPLICATION_STATUS.PENDING,
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(appRef, payload);
  return payload;
};

export const getApplicationByDoctorUid = async (doctorUid) => {
  if (!doctorUid) return null;
  const appId = `app_${doctorUid}`;
  const appRef = doc(db, COLLECTIONS.DOCTOR_APPLICATIONS, appId);
  const snap = await getDoc(appRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

export const getAllDoctorApplications = async (statusFilter = null) => {
  const appsRef = collection(db, COLLECTIONS.DOCTOR_APPLICATIONS);
  let q = appsRef;
  if (statusFilter && statusFilter !== "all") {
    q = query(appsRef, where("status", "==", statusFilter));
  }
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const approveDoctorApplication = async (adminUid, doctorUid, note = "") => {
  const appId = `app_${doctorUid}`;
  const appRef = doc(db, COLLECTIONS.DOCTOR_APPLICATIONS, appId);
  const doctorRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, doctorUid);

  // Update application
  await updateDoc(appRef, {
    status: APPLICATION_STATUS.APPROVED,
    adminReviewNote: note,
    reviewedBy: adminUid,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Update doctor profile
  await updateDoc(doctorRef, {
    verified: true,
    applicationStatus: APPLICATION_STATUS.APPROVED,
    publicStatus: PUBLIC_STATUS.ACTIVE,
    updatedAt: serverTimestamp(),
  });

  // Audit action
  await addDoc(collection(db, COLLECTIONS.ADMIN_ACTIONS), {
    adminUid,
    targetUid: doctorUid,
    action: "APPROVE_DOCTOR",
    metadata: { note },
    timestamp: serverTimestamp(),
  });
};

export const rejectDoctorApplication = async (adminUid, doctorUid, reason = "") => {
  const appId = `app_${doctorUid}`;
  const appRef = doc(db, COLLECTIONS.DOCTOR_APPLICATIONS, appId);
  const doctorRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, doctorUid);

  await updateDoc(appRef, {
    status: APPLICATION_STATUS.REJECTED,
    adminReviewNote: reason,
    reviewedBy: adminUid,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doctorRef, {
    verified: false,
    applicationStatus: APPLICATION_STATUS.REJECTED,
    publicStatus: PUBLIC_STATUS.INACTIVE,
    rejectionReason: reason,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, COLLECTIONS.ADMIN_ACTIONS), {
    adminUid,
    targetUid: doctorUid,
    action: "REJECT_DOCTOR",
    metadata: { reason },
    timestamp: serverTimestamp(),
  });
};

export const suspendDoctor = async (adminUid, doctorUid, reason = "") => {
  const appId = `app_${doctorUid}`;
  const appRef = doc(db, COLLECTIONS.DOCTOR_APPLICATIONS, appId);
  const doctorRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, doctorUid);

  await updateDoc(appRef, {
    status: APPLICATION_STATUS.SUSPENDED,
    adminReviewNote: reason,
    reviewedBy: adminUid,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doctorRef, {
    verified: false,
    applicationStatus: APPLICATION_STATUS.SUSPENDED,
    publicStatus: PUBLIC_STATUS.SUSPENDED,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, COLLECTIONS.ADMIN_ACTIONS), {
    adminUid,
    targetUid: doctorUid,
    action: "SUSPEND_DOCTOR",
    metadata: { reason },
    timestamp: serverTimestamp(),
  });
};
