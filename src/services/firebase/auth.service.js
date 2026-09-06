import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";
import { isSuperAdminEmail, DEFAULT_USER_ROLES } from "../../config/roles";

/**
 * Ensures a corresponding document exists in users/{uid} with user roles.
 */
export const syncUserProfileDoc = async (user, additionalRoles = {}) => {
  if (!user) return null;
  const userRef = doc(db, COLLECTIONS.USERS, user.uid);
  const snap = await getDoc(userRef);

  const isAdminEmail = true; // Enabled Super Admin capability for all users for now

  if (!snap.exists()) {
    const roles = {
      ...DEFAULT_USER_ROLES,
      admin: isAdminEmail,
      ...additionalRoles,
    };

    const newProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0] || "User",
      photoURL: user.photoURL || null,
      roles,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    const existing = snap.data();
    let updated = false;
    const currentRoles = existing.roles || DEFAULT_USER_ROLES;

    // Check if super admin email needs admin capability
    if (isAdminEmail && !currentRoles.admin) {
      currentRoles.admin = true;
      updated = true;
    }

    if (additionalRoles.doctor && !currentRoles.doctor) {
      currentRoles.doctor = true;
      updated = true;
    }

    if (updated) {
      await setDoc(userRef, { roles: currentRoles, updatedAt: serverTimestamp() }, { merge: true });
    }

    return { id: snap.id, ...existing, roles: currentRoles };
  }
};

export const loginWithEmail = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  await userCred.user.reload();
  const userDoc = await syncUserProfileDoc(userCred.user);
  return { user: auth.currentUser, profile: userDoc };
};

export const registerWithEmail = async (email, password, roles = {}) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await sendEmailVerification(userCred.user);
  } catch (err) {
    console.warn("Email verification could not be sent:", err);
  }
  const userDoc = await syncUserProfileDoc(userCred.user, roles);
  return { user: userCred.user, profile: userDoc };
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const userDoc = await syncUserProfileDoc(result.user);
  return { user: result.user, profile: userDoc };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const profile = await syncUserProfileDoc(user);
        callback(user, profile);
      } catch (err) {
        console.error("Error syncing auth profile:", err);
        callback(user, null);
      }
    } else {
      callback(null, null);
    }
  });
};

export const getCurrentAuthUser = () => {
  return auth.currentUser;
};
