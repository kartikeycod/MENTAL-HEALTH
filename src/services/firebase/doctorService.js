import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";
import { APPLICATION_STATUS, PUBLIC_STATUS } from "../../config/statuses";

export const getVerifiedDoctors = async (filters = {}) => {
  try {
    const doctorsRef = collection(db, COLLECTIONS.DOCTOR_PROFILES);
    const q = query(
      doctorsRef,
      where("applicationStatus", "==", APPLICATION_STATUS.APPROVED),
      where("publicStatus", "==", PUBLIC_STATUS.ACTIVE)
    );

    const snap = await getDocs(q);
    let doctors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Apply client-side filtering (specialization, experience, search, rating)
    if (filters.specialization && filters.specialization !== "all") {
      doctors = doctors.filter(
        (doc) =>
          doc.specialization &&
          doc.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      doctors = doctors.filter(
        (doc) =>
          (doc.fullName && doc.fullName.toLowerCase().includes(term)) ||
          (doc.specialization && doc.specialization.toLowerCase().includes(term)) ||
          (doc.bio && doc.bio.toLowerCase().includes(term)) ||
          (doc.location?.city && doc.location.city.toLowerCase().includes(term))
      );
    }

    if (filters.minExperience) {
      doctors = doctors.filter(
        (doc) => Number(doc.experienceYears || 0) >= Number(filters.minExperience)
      );
    }

    if (filters.minRating) {
      doctors = doctors.filter(
        (doc) => Number(doc.ratingSummary?.averageRating || 0) >= Number(filters.minRating)
      );
    }

    // Client-side sorting
    if (filters.sortBy === "price_asc") {
      doctors.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
    } else if (filters.sortBy === "price_desc") {
      doctors.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    } else if (filters.sortBy === "rating") {
      doctors.sort(
        (a, b) =>
          (b.ratingSummary?.averageRating || 0) - (a.ratingSummary?.averageRating || 0)
      );
    } else if (filters.sortBy === "experience") {
      doctors.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    }

    return doctors;
  } catch (err) {
    console.error("Error fetching verified doctors:", err);
    return [];
  }
};

export const getDoctorById = async (doctorId) => {
  if (!doctorId) return null;
  const docRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, doctorId);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const createDoctorProfile = async (uid, profileData) => {
  const docRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, uid);
  const payload = {
    ...profileData,
    uid,
    verified: false,
    applicationStatus: APPLICATION_STATUS.PENDING,
    publicStatus: PUBLIC_STATUS.INACTIVE,
    ratingSummary: {
      averageRating: 0,
      reviewCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, payload);
  return payload;
};

export const updateDoctorProfile = async (uid, updates) => {
  const docRef = doc(db, COLLECTIONS.DOCTOR_PROFILES, uid);

  // Prevent client from manually overriding verified/applicationStatus fields
  const safeUpdates = { ...updates };
  delete safeUpdates.verified;
  delete safeUpdates.applicationStatus;
  delete safeUpdates.ratingSummary;

  safeUpdates.updatedAt = serverTimestamp();
  await updateDoc(docRef, safeUpdates);
};
