import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authChecked) {
      const detailsFilled = localStorage.getItem("detailsFilled") === "true";
      const userData = localStorage.getItem("user");

      if (!loggedIn) {
        alert("Please log in first to continue.");
        window.location.href = "/auth";
      } else if (!detailsFilled || !userData) {
        alert("Please fill out the details form first.");
        window.location.href = "/form";
      } else {
        setReady(true);
      }
    }
  }, [authChecked, loggedIn]);

  if (!ready) return null; // wait until checks complete

  return children;
};

export default ProtectedRoute;
