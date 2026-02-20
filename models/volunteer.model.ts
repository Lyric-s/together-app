import { User } from "./user.model";
import { Mission } from "./mission.model";
import { ProcessingStatus } from "./enums";

/**
 * Volunteer data models.
 * Represents volunteer profiles, including personal information,
 * related user account data, and mission-related statistics.
 */

export interface Volunteer {
  id_volunteer: number;
  id_user: number;
  last_name: string;
  first_name: string;
  phone_number: string;
  birthdate: string;
  skills: string;
  address?: string;
  zip_code?: string;
  bio: string;

  active_missions_count: number;
  finished_missions_count: number;

  user?: User;
  missions?: Mission[];
}

export interface VolunteerCreate {
  last_name: string;
  first_name: string;
  phone_number: string;
  birthdate: string;
  skills: string;
  address?: string;
  zip_code?: string;
  bio: string;
}

export interface VolunteerUpdate {
  last_name?: string;
  first_name?: string;
  phone_number?: string;
  birthdate?: string;
  skills?: string;
  address?: string;
  zip_code?: string;
  bio?: string;

  email?: string;
  password?: string;
}

export interface VolunteerStatus {
  id_volunteer: number;
  id_mission: number;
  state: ProcessingStatus;
  message: string;
  application_date: string;
  rejection_reason: string | null;
  volunteer_first_name: string;
  volunteer_last_name: string;
  volunteer_email: string;
  volunteer_phone: string;
  volunteer_skills: string;
}

// models/volunteer.model.ts

export interface VolunteerPublic {
  id_volunteer: number;
  id_user: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  birthdate: string; // ISO string, ex: "2026-01-14"
  skills: string;
  address: string;
  zip_code: string;
  bio: string;
  active_missions_count: number;
  finished_missions_count: number;
  user: User;
}

export interface VolunteerWithStatus extends Volunteer {
  state: ProcessingStatus;
}
