import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS, SUBCOLLECTIONS } from "../../constants/firebase";

export const saveAIProctorSetup = async (uid, { prefs, packType, schedule, mealPlan }) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);

  const mealPlanData = {
    packType,
    weekNumber: 1,
    meals: mealPlan.map((d, i) => ({
      day: `Day ${i + 1}`,
      breakfast: d[0],
      lunch: d[1],
      dinner: d[2],
      completed: false,
    })),
    generatedAt: serverTimestamp(),
  };

  await setDoc(
    userRef,
    {
      prefs,
      packType,
      schedule: {
        exercise: { time: schedule.exerciseTime },
        meals: schedule.mealTimes,
        weeklyTest: {
          day: schedule.weeklyTestDay,
          nextTestDate: new Date().toISOString(),
        },
      },
      course: {
        currentDay: 1,
        progressPct: 0,
        streak: 0,
        status: "active",
        startedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await addDoc(collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.MEAL_PLAN), mealPlanData);
};

export const fetchAIProctorPlan = async (uid) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  const course = data.course || {};
  const dayNumber = course.currentDay || 1;

  const plansSnap = await getDocs(
    collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.MEAL_PLAN)
  );
  const allMeals = [];
  plansSnap.forEach((p) => allMeals.push(...(p.data().meals || [])));

  const todayPlan = allMeals.find((m) => m.day === `Day ${dayNumber}`);

  return {
    course,
    dayPlan: todayPlan || null,
  };
};

export const completeAIDay = async (uid, course, completedChecklist) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const newDay = (course.currentDay || 1) + 1;
  const newProgress = Math.min(((newDay - 1) / 28) * 100, 100);
  const newStreak = (course.streak || 0) + 1;

  await updateDoc(userRef, {
    "course.currentDay": newDay,
    "course.progressPct": newProgress,
    "course.streak": newStreak,
    "course.updatedAt": serverTimestamp(),
    [`completedDays.day${course.currentDay}`]: {
      meals: completedChecklist,
      completedAt: new Date().toISOString(),
    },
  });
};

export const logExerciseSession = async (uid) => {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("User record not found.");

  const currentDay = snap.data()?.course?.currentDay || 1;
  const logRef = collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.EXERCISE_LOGS);

  await addDoc(logRef, {
    date: new Date().toISOString().split("T")[0],
    duration: 30,
    status: "completed",
    completedAt: serverTimestamp(),
  });

  await updateDoc(ref, {
    "course.exerciseDone": true,
    "course.currentDay": currentDay,
    updatedAt: serverTimestamp(),
  });
};

export const submitWeeklyTestResults = async (uid, answers, questionsCount) => {
  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const avgScore = (totalScore / questionsCount).toFixed(2);

  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  const weekNum = Math.ceil((userData?.course?.currentDay || 1) / 7);

  await addDoc(collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.WEEKLY_TESTS), {
    week: weekNum,
    answers,
    totalScore,
    avgScore,
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.USER_STATS), {
    type: "weeklyTest",
    week: weekNum,
    avgScore: parseFloat(avgScore),
    date: new Date().toISOString().split("T")[0],
    recordedAt: serverTimestamp(),
  });

  const completedWeeks = weekNum;
  const totalWeeks = 4;
  const progressPct = Math.min(100, (completedWeeks / totalWeeks) * 100);

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 7);

  await updateDoc(userRef, {
    "course.progressPct": progressPct,
    "course.updatedAt": serverTimestamp(),
    "schedule.weeklyTest.nextTestDate": nextDate.toISOString(),
    "schedule.weeklyTest.lastTaken": serverTimestamp(),
    "course.testsCompleted": increment(1),
  });

  return { avgScore, totalScore };
};

export const fetchAnalyticsData = async (uid) => {
  const userRef = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(userRef);
  const userData = snap.data() || {};

  const streak = userData.course?.streak || 0;
  const progressPct = userData.course?.progressPct || 0;

  const exerciseSnap = await getDocs(
    collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.EXERCISE_LOGS)
  );
  const exerciseSessions = exerciseSnap.size;

  const weeklySnap = await getDocs(
    collection(db, COLLECTIONS.USERS, uid, SUBCOLLECTIONS.WEEKLY_TESTS)
  );
  const weeklyScores = weeklySnap.docs.map((d) => d.data()?.avgScore || 0);
  const avgScore =
    weeklyScores.length > 0
      ? (weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length).toFixed(2)
      : 0;

  return {
    streak,
    exerciseSessions,
    avgScore,
    progressPct,
  };
};
