import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { STORAGE_PATHS } from "../../constants/firebase";

export const uploadLeisureProofImage = async (uid, file) => {
  const fileRef = ref(storage, `${STORAGE_PATHS.LEISURE_PROOFS}/${uid}_${Date.now()}.jpg`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};
