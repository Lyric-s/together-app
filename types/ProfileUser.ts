interface BaseProfile {
  id_user?: number
  email: string;
  username: string;
  picture?: any;
  password?: string;
  confirmPassword?: string;
}

export interface AdminProfile extends BaseProfile {
  type: 'admin';
  id_admin: number;
  first_name: string;
  last_name: string;
}

export interface VolunteerProfile extends BaseProfile {
  type: 'volunteer';
  id_volunteer: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  birthdate: string;
  address?: string;
  zip_code?: string;
  skills?: string;
  bio?: string;
}

export interface AssociationProfile extends BaseProfile {
  type: 'association';
  id_asso: number;
  name: string;
  phone_number: string;
  rna_code: string;
  company_name: string;
  description?: string;
  address?: string;
  zip_code?: string;
  country?: string;
  id_user: number;
}

export type UserProfile = AdminProfile | VolunteerProfile | AssociationProfile;
