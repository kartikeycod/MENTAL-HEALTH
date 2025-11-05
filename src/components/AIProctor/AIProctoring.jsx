// // ✅ src/components/AIProctor/AIProctoring.jsx
// import React, { useEffect, useState } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import AIProctorDashboard from "./AIProctorDashboard";

// const AIProctoring = () => {
//   const [uid, setUid] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const auth = getAuth();
//   const db = getFirestore();

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         alert("⚠️ Please log in to access AI Proctoring.");
//         window.location.href = "/auth";
//         return;
//       }

//       setUid(user.uid);

//       // Load user data from Firestore
//       const userRef = doc(db, "users", user.uid);
//       const snap = await getDoc(userRef);
//       if (snap.exists()) {
//         setUserData(snap.data());
//       }

//       setLoading(false);
//     });

//     return () => unsub();
//   }, [auth, db]);

//   const handleEditSetup = () => {
//     alert("🔧 Redirecting to plan setup...");
//     window.location.href = "/plan";
//   };

//   if (loading)
//     return (
//       <div style={{ textAlign: "center", marginTop: "60px" }}>
//         <h2>Loading your AI Proctoring dashboard...</h2>
//       </div>
//     );

//   return (
//     <AIProctorDashboard uid={uid} userData={userData} onEdit={handleEditSetup} />
//   );
// };

// export default AIProctoring;
