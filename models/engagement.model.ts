import { ProcessingStatus } from "./enums";

/**
 * Engagement data models.
 * Represents a volunteer's application to a mission, including its
 * current processing state and related metadata.
 * Also defines payloads for applying to a mission and updating application status.
 */

export interface Engagement {
  id_volunteer: number;
  id_mission: number;
  state: ProcessingStatus;
  message?: string;
  application_date: string; // ISO date
  rejection_reason?: string;
}

export interface EngagementCreate {
  id_mission: number;
  message?: string;
}

/**
 * When association answer to the volunteer engagement
 */
export interface EngagementUpdate {
  state?: ProcessingStatus;
  rejection_reason?: string;
}
