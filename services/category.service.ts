import api from './api';
import { AxiosError } from 'axios';
import { handleApiError } from '@/services/apiErrorHandler';
import { Category } from '@/models/category.model';

export const categoryService = {
    /**
   * Retrieve all public categories.
   * GET /categories/
   * @returns {Promise<CategoryPublic[]>} A promise that resolves to an array of public categories sorted alphabetically.
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const { data } = await api.get<Category[]>('/categories/');
      return data;
    } catch (error) {
      handleApiError(error);
      return []; // fallback empty array
    }
  },
};