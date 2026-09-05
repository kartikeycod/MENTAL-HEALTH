import { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../services/firebase/auth.service";
import { getDetailsFilled, getStoredUser } from "../utils/storage/storageHelpers";
import { ROUTES } from "../constants/routes";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setLoggedIn(!!user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authChecked) {
      const detailsFilled = getDetailsFilled();
      const userData = getStoredUser();

      if (!loggedIn) {
        alert("Please log in first to continue.");
        window.location.href = ROUTES.AUTH;
      } else if (!detailsFilled || !userData) {
        alert("Please fill out the details form first.");
        window.location.href = ROUTES.FORM;
      } else {
        setReady(true);
      }
    }
  }, [authChecked, loggedIn]);

  if (!ready) return null;

  return children;
};

export default ProtectedRoute;
