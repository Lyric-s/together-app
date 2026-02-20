import { UserType } from "./enums";

/**
 * User data models.
 * Represents application users and the payloads used for user creation
 * and updates, excluding any backend-only or security-sensitive fields.
 */

export interface User {
  id_user: number;
  username: string;
  email: string;
  user_type: UserType;
  date_creation: string; // ISO string
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  user_type: UserType;
}

export interface UserUpdate {
  email?: string;
  password?: string;
  user_type?: UserType;
}
