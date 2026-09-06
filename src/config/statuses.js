export const APPLICATION_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

export const PUBLIC_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

export const STATUS_CONFIG = {
  [APPLICATION_STATUS.PENDING]: {
    label: "Pending Verification",
    color: "#eab308", // amber
    bgColor: "#fef9c3",
    description: "Your application is currently awaiting review by the Super Admin.",
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    label: "Under Review / Info Requested",
    color: "#3b82f6", // blue
    bgColor: "#dbeafe",
    description: "Your application is currently under detailed review by our clinical verification team.",
  },
  [APPLICATION_STATUS.APPROVED]: {
    label: "Verified & Approved",
    color: "#22c55e", // green
    bgColor: "#dcfce7",
    description: "Your profile is verified and active on the Serenium marketplace.",
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: "Application Rejected",
    color: "#ef4444", // red
    bgColor: "#fee2e2",
    description: "Your application was not approved. Please see admin feedback or contact support.",
  },
  [APPLICATION_STATUS.SUSPENDED]: {
    label: "Account Suspended",
    color: "#6b7280", // gray
    bgColor: "#f3f4f6",
    description: "Your doctor practice account is temporarily suspended.",
  },
};
