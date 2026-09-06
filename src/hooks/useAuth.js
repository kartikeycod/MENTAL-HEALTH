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
import { SUPER_ADMIN_EMAIL, hasRole, ROLES } from "../config/roles";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuthChanges((u, p) => {
      setUser(u);
      setProfile(p);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const { user: u, profile: p } = await loginWithEmail(email, password);
    if (u) {
      const userData = {
        name: p?.displayName || u.displayName || u.email.split("@")[0],
        email: u.email,
        uid: u.uid,
        roles: p?.roles || {},
      };
      setStoredUser(userData);
    }
    return { user: u, profile: p };
  };

  const register = async (email, password, roles = {}) => {
    return await registerWithEmail(email, password, roles);
  };

  const googleSignIn = async () => {
    const { user: u, profile: p } = await loginWithGoogle();
    if (u) {
      const userName = p?.displayName || u.displayName || "User";
      const userData = { name: userName, email: u.email, uid: u.uid, roles: p?.roles || {} };
      setStoredUser(userData);
    }
    return { user: u, profile: p };
  };

  const logout = async () => {
    await logoutUser();
    removeStoredUser();
    removeDetailsFilled();
    setUser(null);
    setProfile(null);
  };

  const isDoctor = !!(profile?.roles?.doctor || (profile?.roles?.admin));
  const isPatient = true; // All users have patient capability
  const isAdmin = !!(
    profile?.roles?.admin ||
    (user?.email && user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase())
  );

  return {
    user,
    profile,
    loading,
    login,
    register,
    googleSignIn,
    logout,
    isDoctor,
    isPatient,
    isAdmin,
    roles: profile?.roles || {},
    hasRole: (role) => hasRole(profile?.roles, role),
  };
};
