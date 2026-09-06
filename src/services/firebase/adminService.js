import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const getUsersList = async ({ roleFilter = "all", searchQuery = "" } = {}) => {
  const usersRef = collection(db, COLLECTIONS.USERS);
  const snap = await getDocs(usersRef);
  let users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (roleFilter !== "all") {
    users = users.filter((u) => u.roles && u.roles[roleFilter] === true);
  }

  if (searchQuery) {
    const term = searchQuery.toLowerCase();
    users = users.filter(
      (u) =>
        (u.displayName && u.displayName.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term)) ||
        u.id.toLowerCase().includes(term)
    );
  }

  return users;
};

export const getAdminActionLogs = async (limitCount = 50) => {
  const actionsRef = collection(db, COLLECTIONS.ADMIN_ACTIONS);
  const snap = await getDocs(actionsRef);
  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return logs.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)).slice(0, limitCount);
};

export const getPlatformMetrics = async () => {
  const usersSnap = await getDocs(collection(db, COLLECTIONS.USERS));
  const doctorsSnap = await getDocs(collection(db, COLLECTIONS.DOCTOR_PROFILES));
  const appsSnap = await getDocs(collection(db, COLLECTIONS.DOCTOR_APPLICATIONS));
  const ordersSnap = await getDocs(collection(db, COLLECTIONS.ORDERS));

  const totalUsers = usersSnap.size;
  const doctorsList = doctorsSnap.docs.map((d) => d.data());
  const verifiedDoctors = doctorsList.filter((d) => d.applicationStatus === "approved").length;
  const pendingApplications = appsSnap.docs
    .map((d) => d.data())
    .filter((a) => a.status === "pending").length;
  const totalOrders = ordersSnap.size;

  return {
    totalUsers,
    totalDoctors: doctorsList.length,
    verifiedDoctors,
    pendingApplications,
    totalOrders,
  };
};
