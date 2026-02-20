/**
 * Favorite data models.
 * Represents the relationship between volunteers and their favorited missions,
 * as well as the payload used to add a mission to favorites.
 */

export interface Favorite {
  id_volunteer: number;
  id_mission: number;
  created_at: string;
}

export interface FavoriteCreate {
  id_mission: number;
}
