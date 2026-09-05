import { useState, useEffect } from "react";
import {
  subscribeToAuthChanges,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser,
} from "../services/firebase/auth.service";
import {
  setStoredUser,
  removeStoredUser,
  removeDetailsFilled,
} from "../utils/storage/storageHelpers";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const u = await loginWithEmail(email, password);
    if (u && u.emailVerified) {
      const userData = {
        name: u.displayName || u.email.split("@")[0],
        email: u.email,
        uid: u.uid,
      };
      setStoredUser(userData);
    }
    return u;
  };

  const register = async (email, password) => {
    return await registerWithEmail(email, password);
  };

  const googleSignIn = async () => {
    const u = await loginWithGoogle();
    if (u) {
      const userName = u.displayName || "User";
      const userData = { name: userName, email: u.email, uid: u.uid };
      setStoredUser(userData);
    }
    return u;
  };

  const logout = async () => {
    await logoutUser();
    removeStoredUser();
    removeDetailsFilled();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    googleSignIn,
    logout,
  };
};
