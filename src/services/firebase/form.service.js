import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const getFormByUid = async (uid) => {
  const q = query(collection(db, COLLECTIONS.FORMS), where("UID", "==", uid));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
};

export const submitUserForm = async (user, formData) => {
  await addDoc(collection(db, COLLECTIONS.FORMS), {
    UID: user.uid,
    EMAIL: user.email,
    NAME: formData.NAME,
    AGE: Number(formData.AGE),
    PROFESSION: formData.PROFESSION,
    GENDER: formData.GENDER,
    ADDRESS: formData.ADDRESS,
    LOCATION: formData.LOCATION,
    STRESSLEVEL: formData.STRESSLEVEL,
    SLEEPHOURS: Number(formData.SLEEPHOURS),
    MOOD: formData.MOOD,
    CREATEDAT: new Date(),
  });
};
