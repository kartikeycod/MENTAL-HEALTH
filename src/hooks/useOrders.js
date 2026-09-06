import { useState, useEffect, useCallback } from "react";
import {
  createDemoOrder,
  getPatientOrders,
  getDoctorOrders,
  checkPatientPurchasedDoctor,
} from "../services/firebase/orderService";
import { useAuth } from "./useAuth";

export const useOrders = () => {
  const { user, profile } = useAuth();
  const [patientOrders, setPatientOrders] = useState([]);
  const [doctorOrders, setDoctorOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const pOrders = await getPatientOrders(user.uid);
      setPatientOrders(pOrders);

      if (profile?.roles?.doctor) {
        const dOrders = await getDoctorOrders(user.uid);
        setDoctorOrders(dOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, profile?.roles?.doctor]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const purchaseDemoPlan = async ({ doctorUid, doctorName, planId, planTitle, amount }) => {
    if (!user?.uid) {
      throw new Error("Please log in to purchase a plan.");
    }
    setPurchasing(true);
    try {
      const newOrder = await createDemoOrder({
        patientUid: user.uid,
        patientName: profile?.displayName || user.displayName || user.email.split("@")[0],
        doctorUid,
        doctorName,
        planId,
        planTitle,
        amount,
        currency: "INR",
      });

      setPatientOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("Demo purchase failed:", err);
      throw err;
    } finally {
      setPurchasing(false);
    }
  };

  const verifyPurchaseEligibility = async (doctorUid) => {
    if (!user?.uid || !doctorUid) return false;
    return await checkPatientPurchasedDoctor(user.uid, doctorUid);
  };

  return {
    patientOrders,
    doctorOrders,
    loading,
    purchasing,
    purchaseDemoPlan,
    verifyPurchaseEligibility,
    refresh: fetchOrders,
  };
};
