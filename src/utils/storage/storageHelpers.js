import { STORAGE_KEYS } from "../../constants/storageKeys";

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Error parsing stored user from localStorage:", err);
    return null;
  }
};

export const setStoredUser = (userObj) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
  } catch (err) {
    console.error("Error setting user in localStorage:", err);
  }
};

export const removeStoredUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (err) {
    console.error("Error removing user from localStorage:", err);
  }
};

export const getDetailsFilled = () => {
  return localStorage.getItem(STORAGE_KEYS.DETAILS_FILLED) === "true";
};

export const setDetailsFilled = (val = true) => {
  localStorage.setItem(STORAGE_KEYS.DETAILS_FILLED, val ? "true" : "false");
};

export const removeDetailsFilled = () => {
  localStorage.removeItem(STORAGE_KEYS.DETAILS_FILLED);
};

export const getSelectedPlan = () => {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_PLAN);
};

export const setSelectedPlan = (plan) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_PLAN, plan);
};

export const setCourseStatus = (status) => {
  localStorage.setItem(STORAGE_KEYS.COURSE_STATUS, status);
};

export const setPackType = (packType) => {
  localStorage.setItem(STORAGE_KEYS.PACK_TYPE, packType);
};
