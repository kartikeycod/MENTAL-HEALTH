import { useState, useEffect } from "react";
import { getUserDoc, updateUserProfile } from "../services/firebase/user.service";
import { useAuth } from "./useAuth";

export const useUser = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!user?.uid) {
      setUserData(null);
      setLoading(false);
      return;
    }

    getUserDoc(user.uid)
      .then((data) => {
        if (isMounted) setUserData(data);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const update = async (updates) => {
    if (!user?.uid) return;
    await updateUserProfile(user.uid, updates);
    setUserData((prev) => ({ ...prev, ...updates }));
  };

  return { userData, loading, update };
};
