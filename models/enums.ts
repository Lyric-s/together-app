/**
 * Shared enumerations used across the frontend application.
 * These enums mirror backend enums and define fixed sets of values
 * such as user roles, processing states, and report classifications.
 */

export enum UserType {
  ADMIN = "ADMIN",
  VOLUNTEER = "VOLUNTEER",
  ASSOCIATION = "ASSOCIATION",
}

export enum ProcessingStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ReportType {
  HARASSMENT = "HARASSMENT",
  INAPPROPRIATE_BEHAVIOR = "INAPPROPRIATE_BEHAVIOR",
  SPAM = "SPAM",
  FRAUD = "FRAUD",
  OTHER = "OTHER",
}

export enum ReportTarget {
  PROFILE = "PROFILE",
  MESSAGE = "MESSAGE",
  MISSION = "MISSION",
  OTHER = "OTHER",
}