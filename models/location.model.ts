/**
 * Location data models.
 * Represents geographic and address-related information associated
 * with missions, including optional coordinates.
 */

export interface Location {
  id_location: number;
  address?: string;
  country?: string;
  zip_code?: string;
  lat?: number;
  longitude?: number;
}

export interface LocationCreate {
  address?: string;
  country?: string;
  zip_code?: string;
  lat?: number;
  longitude?: number;
}

export interface LocationUpdate {
  address?: string;
  country?: string;
  zip_code?: string;
  lat?: number;
  longitude?: number;
}
