/**
 * Shared enumerations used across the frontend application.
 * These enums mirror backend enums and define fixed sets of values
 * such as user roles, processing states, and report classifications.
 */

export enum UserType {
  ADMIN = "admin",
  VOLUNTEER = "volunteer",
  ASSOCIATION = "association",
}

export enum ProcessingStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ReportType {
  HARASSMENT = "harassment",
  INAPPROPRIATE_BEHAVIOR = "inappropriate_behavior",
  SPAM = "spam",
  FRAUD = "fraud",
  OTHER = "other",
}

export enum ReportTarget {
  PROFILE = "profile",
  MESSAGE = "message",
  MISSION = "mission",
  OTHER = "other",
}
