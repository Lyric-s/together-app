import { Category } from "./category.model";
import { Location } from "./location.model";
import { Association } from "./association.model";

/**
 * Mission data models.
 * Defines volunteer missions, including their relationships to
 * locations, categories, and associations, as well as create/update payloads.
 */

export interface Mission {
  id_mission: number;
  name: string;
  date_start: string;
  date_end: string;
  skills: string;
  description: string;
  capacity_min: number;
  capacity_max: number;
  image_url?: string;
  volunteers_enrolled: number;
  available_slots: number;
  is_full: boolean;

  id_location: number;
  id_categ: number;
  id_asso: number;

  location?: Location;
  category?: Category;
  association?: Association;
}

export interface MissionCreate {
  name: string;
  id_location: number;
  id_categs: Category[];
  id_asso: number;
  date_start: string;
  date_end: string;
  skills: string;
  description: string;
  capacity_min: number;
  capacity_max: number;
  image_url?: string;
}

export interface MissionUpdate {
  name?: string;
  id_location?: number;
  id_categs?: Category[];
  date_start?: string;
  date_end?: string;
  skills?: string;
  description?: string;
  capacity_min?: number;
  capacity_max?: number;
  image_url?: string;
}

export interface MissionPublic extends Mission {
  volunteers_enrolled: number;
  available_slots: number;
  is_full: boolean;
  categories?: Category[];
  association?: Association;
}

