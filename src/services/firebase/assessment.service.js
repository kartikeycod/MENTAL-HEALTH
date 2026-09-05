import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const saveMentalHealthAssessment = async ({
  user,
  nameFromDB,
  answers,
  subscores,
  MHI,
  normalized,
  conclusion,
  suicidalFlag,
}) => {
  const payload = {
    uid: user.uid,
    email: user.email,
    name: nameFromDB || "",
    answers,
    subscores,
    mhi: MHI,
    mhi_normalized: normalized,
    conclusion,
    suicidalFlag,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, COLLECTIONS.MENTAL_HEALTH_TESTS), payload);
};
