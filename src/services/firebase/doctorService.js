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
    const snap = await getDocs(doctorsRef);
    let doctors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Filter by Specialization
    if (filters.specialization && filters.specialization !== "all") {
      doctors = doctors.filter(
        (doc) =>
          doc.specialization &&
          doc.specialization.toLowerCase().includes(filters.specialization.toLowerCase())
      );
    }

    // Filter by Location (City, State, Country, Address)
    if (filters.location) {
      const locTerm = filters.location.toLowerCase();
      doctors = doctors.filter((doc) => {
        const city = doc.location?.city || "";
        const state = doc.location?.state || "";
        const country = doc.location?.country || "";
        const address = doc.location?.address || "";
        const fullLoc = `${city} ${state} ${country} ${address}`.toLowerCase();
        return fullLoc.includes(locTerm);
      });
    }

    // Filter by Search (Name, Specialization, Bio, Location)
    if (filters.search) {
      const term = filters.search.toLowerCase();
      doctors = doctors.filter(
        (doc) =>
          (doc.fullName && doc.fullName.toLowerCase().includes(term)) ||
          (doc.displayName && doc.displayName.toLowerCase().includes(term)) ||
          (doc.specialization && doc.specialization.toLowerCase().includes(term)) ||
          (doc.bio && doc.bio.toLowerCase().includes(term)) ||
          (doc.location?.city && doc.location.city.toLowerCase().includes(term)) ||
          (doc.location?.state && doc.location.state.toLowerCase().includes(term)) ||
          (doc.location?.address && doc.location.address.toLowerCase().includes(term))
      );
    }

    // Filter by Max Price
    if (filters.maxPrice && Number(filters.maxPrice) > 0) {
      doctors = doctors.filter(
        (doc) => Number(doc.startingPrice || 0) <= Number(filters.maxPrice)
      );
    }

    // Filter by Min Experience
    if (filters.minExperience) {
      doctors = doctors.filter(
        (doc) => Number(doc.experienceYears || 0) >= Number(filters.minExperience)
      );
    }

    // Filter by Min Rating
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
    console.error("Error fetching doctors marketplace:", err);
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
