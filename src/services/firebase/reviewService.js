import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";
import { checkPatientPurchasedDoctor } from "./orderService";

export const getDoctorReviews = async (doctorUid) => {
  if (!doctorUid) return [];
  const reviewsRef = collection(db, COLLECTIONS.DOCTOR_REVIEWS);
  const q = query(reviewsRef, where("doctorUid", "==", doctorUid));
  const snap = await getDocs(q);
  const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return reviews.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

export const hasPatientReviewedDoctor = async (patientUid, doctorUid) => {
  if (!patientUid || !doctorUid) return false;
  const reviewsRef = collection(db, COLLECTIONS.DOCTOR_REVIEWS);
  const q = query(
    reviewsRef,
    where("patientUid", "==", patientUid),
    where("doctorUid", "==", doctorUid)
  );
  const snap = await getDocs(q);
  return !snap.empty;
};

export const createReview = async ({
  doctorUid,
  patientUid,
  patientName = "Anonymous Patient",
  orderId,
  rating,
  comment,
}) => {
  if (!doctorUid || !patientUid || !rating) {
    throw new Error("Doctor, patient, and rating are required.");
  }

  // Trusted server/service validation: Must have purchased a plan
  const hasPurchased = await checkPatientPurchasedDoctor(patientUid, doctorUid);
  if (!hasPurchased) {
    throw new Error("You must purchase a consultation plan from this therapist before submitting a review.");
  }

  // Enforce one review per patient for this doctor
  const alreadyReviewed = await hasPatientReviewedDoctor(patientUid, doctorUid);
  if (alreadyReviewed) {
    throw new Error("You have already submitted a review for this therapist.");
  }

  const reviewsRef = collection(db, COLLECTIONS.DOCTOR_REVIEWS);
  const payload = {
    doctorUid,
    patientUid,
    patientName,
    orderId: orderId || null,
    rating: Number(rating),
    comment: comment || "",
    status: "approved",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(reviewsRef, payload);

  // Recalculate doctor rating summary
  await recalculateDoctorRatingSummary(doctorUid);

  return { id: docRef.id, ...payload };
};

export const recalculateDoctorRatingSummary = async (doctorUid) => {
  const reviews = await getDoctorReviews(doctorUid);
  if (reviews.length === 0) {
    const doctorRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, doctorUid);
    await updateDoc(doctorRef, {
      ratingSummary: {
        averageRating: 0,
        reviewCount: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    });
    return;
  }

  let totalRating = 0;
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((r) => {
    const rate = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    ratingDistribution[rate] = (ratingDistribution[rate] || 0) + 1;
    totalRating += r.rating;
  });

  const averageRating = Number((totalRating / reviews.length).toFixed(1));

  const doctorRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, doctorUid);
  const doctorSnap = await getDoc(doctorRef);
  if (doctorSnap.exists()) {
    await updateDoc(doctorRef, {
      ratingSummary: {
        averageRating,
        reviewCount: reviews.length,
        ratingDistribution,
      },
    });
  }
};
