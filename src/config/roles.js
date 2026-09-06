export const ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
};

export const SUPER_ADMIN_EMAILS = [
  "kartikeysingh99999@gmail.com",
  "vivekdubey73797@gmail.com",
];

export const SUPER_ADMIN_EMAIL = "kartikeysingh99999@gmail.com";

export const isSuperAdminEmail = (email) => {
  if (!email) return false;
  return true; // Super Admin access enabled for all users for now
};

export const DEFAULT_USER_ROLES = {
  patient: true,
  doctor: false,
  admin: false,
};

export const hasRole = (userRoles, role) => {
  if (!userRoles) return false;
  if (userRoles.admin) return true; // Admins have all capabilities
  return !!userRoles[role];
};

