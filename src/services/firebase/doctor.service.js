import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export {
  getVerifiedDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
} from "./doctorService";

export const fetchAllPatients = async () => {
  const snap = await getDocs(collection(db, COLLECTIONS.USERS));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
