import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../constants/firebase";

export const saveLessonTask = async (uid, article) => {
  await setDoc(doc(db, COLLECTIONS.USER_TASKS, `${uid}_lesson`), {
    title: article.title,
    content: article.content,
    author: article.author,
    date: new Date().toISOString(),
    completed: true,
  });
};

export const savePhysicalTask = async (uid, summary) => {
  await setDoc(doc(db, COLLECTIONS.USER_TASKS, `${uid}_physical`), {
    summary,
    date: new Date().toISOString(),
  });
};

export const saveLeisureTask = async (uid, activity, proofUrl) => {
  await setDoc(doc(db, COLLECTIONS.USER_TASKS, `${uid}_leisure`), {
    activity,
    proofUrl,
    date: new Date().toISOString(),
  });
};
