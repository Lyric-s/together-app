/**
 * Category data models.
 * Represents mission categories and the data required to create them.
 */

export interface Category {
  id_categ: number;
  label: string;
}

export interface CategoryCreate {
  label: string;
}
