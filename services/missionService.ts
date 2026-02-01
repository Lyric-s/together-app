import api from './api';
import { Mission } from '@/models/mission.model';
import { mapApiToMission } from '@/utils/mission.utils';

// Interface pour les filtres de recherche
export interface MissionFilters {
  search?: string;
  category_ids?: number[]; // Liste d'IDs (ex: [1, 5])
  country?: string;
  zip_code?: string;
  date_available?: Date | string; // Date ou chaîne ISO
  show_full?: boolean; // Par défaut true
}

export const missionService = {
  
  /**
   * Récupère toutes les missions publiques avec filtres optionnels.
   * Endpoint: GET /missions
   */
  getAll: async (filters: MissionFilters = {}): Promise<Mission[]> => {
    // Construction des paramètres de requête
    const params: any = {};

    if (filters.search) params.search = filters.search;
    if (filters.country) params.country = filters.country;
    if (filters.zip_code) params.zip_code = filters.zip_code;
    
    // Gestion de la date (conversion en ISO string simple YYYY-MM-DD si c'est un objet Date)
    if (filters.date_available) {
      if (filters.date_available instanceof Date) {
        const yyyy = filters.date_available.getFullYear();
        const mm = String(filters.date_available.getMonth() + 1).padStart(2, '0');
        const dd = String(filters.date_available.getDate()).padStart(2, '0');
        params.date_available = `${yyyy}-${mm}-${dd}`;
      } else {
        params.date_available = filters.date_available;
      }
    }

    // Gestion du booléen show_full
    if (filters.show_full !== undefined) {
      params.show_full = filters.show_full;
    }

    // Gestion du tableau de catégories : conversion en string "1,5"
    if (filters.category_ids && filters.category_ids.length > 0) {
      params.category_ids = filters.category_ids.join(',');
    }

    try {
      const response = await api.get<any[]>('/missions', { params });
      // Transformation de chaque élément du tableau
      return response.data.map(mapApiToMission);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions:", error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'une mission spécifique.
   * Endpoint: GET /missions/{id}
   */
  getById: async (missionId: number): Promise<Mission> => {
    try {
      const response = await api.get<any>(`/missions/${missionId}`);
      // Transformation de l'objet unique
      return mapApiToMission(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la mission ${missionId}:`, error);
      throw error;
    }
  }
};