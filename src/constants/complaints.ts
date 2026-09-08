export const complaintCategories = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Security",
  "Lift / Elevator",
  "Water Supply",
  "Garbage / Waste",
  "Parking",
  "Common Area",
  "Noise",
  "Other",
];

export const complaintPriorities = ["low", "normal", "urgent"] as const;

export const complaintStatuses = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
] as const;
