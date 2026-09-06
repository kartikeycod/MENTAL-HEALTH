import { useState, useEffect, useCallback } from "react";
import { getUsersList, getAdminActionLogs, getPlatformMetrics } from "../services/firebase/adminService";
import {
  getAllDoctorApplications,
  approveDoctorApplication,
  rejectDoctorApplication,
  suspendDoctor,
} from "../services/firebase/doctorApplicationService";
import { useAuth } from "./useAuth";

export const useAdmin = () => {
  const { user, isAdmin } = useAuth();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    verifiedDoctors: 0,
    pendingApplications: 0,
    totalOrders: 0,
  });

  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [actionLogs, setActionLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("all");

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [metricsData, usersData, appsData, logsData] = await Promise.all([
        getPlatformMetrics(),
        getUsersList({ roleFilter: userRoleFilter, searchQuery: userSearchQuery }),
        getAllDoctorApplications(appStatusFilter),
        getAdminActionLogs(50),
      ]);

      setMetrics(metricsData);
      setUsers(usersData);
      setApplications(appsData);
      setActionLogs(logsData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, userRoleFilter, userSearchQuery, appStatusFilter]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const approveApplication = async (doctorUid, note = "") => {
    if (!user?.uid || !isAdmin) return;
    await approveDoctorApplication(user.uid, doctorUid, note);
    await loadAdminData();
  };

  const rejectApplication = async (doctorUid, reason = "") => {
    if (!user?.uid || !isAdmin) return;
    await rejectDoctorApplication(user.uid, doctorUid, reason);
    await loadAdminData();
  };

  const suspendDoctorAccount = async (doctorUid, reason = "") => {
    if (!user?.uid || !isAdmin) return;
    await suspendDoctor(user.uid, doctorUid, reason);
    await loadAdminData();
  };

  return {
    metrics,
    users,
    applications,
    actionLogs,
    loading,
    userRoleFilter,
    setUserRoleFilter,
    userSearchQuery,
    setUserSearchQuery,
    appStatusFilter,
    setAppStatusFilter,
    approveApplication,
    rejectApplication,
    suspendDoctorAccount,
    refresh: loadAdminData,
  };
};
