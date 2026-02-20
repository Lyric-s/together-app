import api from './api';
import { Volunteer, VolunteerCreate, VolunteerPublic, VolunteerUpdate } from '@/models/volunteer.model';
import { Mission } from '@/models/mission.model';
import { UserCreate } from '@/models/user.model';
import { handleApiError } from '@/services/apiErrorHandler'
import { ProcessingStatus } from '@/models/enums';
import { mapApiToMission } from '@/utils/mission.utils';

// --- Service ---
export const volunteerService = {

  /**
   * Create a new volunteer account
   * POST /volunteers/
   */
  register: async (userIn: UserCreate, volunteerIn: VolunteerCreate): Promise<Volunteer> => {
    try {
      const { data } = await api.post<Volunteer>('/volunteers/', {
        user_in: userIn,
        volunteer_in: volunteerIn,
      });
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Retrieve MY profile
   * GET /volunteers/me
   */
  getMe: async (): Promise<Volunteer> => {
    try {
      const { data } = await api.get<Volunteer>('/volunteers/me');
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Récupère le profil public complet d'un bénévole par son ID
   * GET /volunteers/{volunteer_id}
   * @param volunteerId L'ID unique du bénévole
   * @returns VolunteerPublic
   */
  getById: async (volunteerId: number): Promise<VolunteerPublic | null> => {
    try {
      const { data } = await api.get<VolunteerPublic>(`/volunteers/${volunteerId}`);
      return data;
    } catch (error) {
      handleApiError(error);
      return null; // retourne null en cas d'erreur
    }
  },

  /**
   * Update MY profile
   * PATCH /volunteers/${volunteerId}
   */
  updateMe: async (volunteerId: number, payload: VolunteerUpdate): Promise<Volunteer> => {
    try {
      const { data } = await api.patch<Volunteer>(`/volunteers/${volunteerId}`, payload);
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Delete MY account
   * DELETE /volunteers/${volunteerId}
   */
  deleteProfile: async (volunteerId: number): Promise<void> => {
    try {
      await api.delete(`/volunteers/${volunteerId}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Retrieve MY assignments (Approved/Active)
   * Optionally filtered by date (‘today’ or YYYY-MM-DD)
   * GET /volunteers/me/missions
   */
  getMyMissions: async (targetDate?: string): Promise<Mission[]> => {
    try {
      // dateFilter format: "YYYY-MM-DD"
      const params = targetDate ? { target_date: targetDate } : undefined;
      const { data } = await api.get<any[]>('/volunteers/me/missions', { params });
      return data.map(mapApiToMission);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Missions À VENIR (Date de début >= Aujourd'hui)
   * Utilisé pour la page: (volunteer)/library/upcoming
   */
  getEnrolledMissions: async (): Promise<Mission[]> => {
    try {
      const allMissions = await volunteerService.getMyMissions();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = allMissions.filter(mission => {
        const missionDate = new Date(mission.date_start);
        return missionDate >= today;
      });

      return upcoming.sort((a, b) => 
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
      );

    } catch (error) {
      console.error("Erreur getEnrolledMissions", error);
      return [];
    }
  },

  /**
   * Missions PASSÉES (Date de début < Aujourd'hui)
   */
  getHistoryMissions: async (): Promise<Mission[]> => {
    try {
      const allMissions = await volunteerService.getMyMissions();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const history = allMissions.filter(mission => {
        const missionDate = new Date(mission.date_start);
        return missionDate < today;
      });

      return history.sort((a, b) => 
        new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
      );

    } catch (error) {
      console.error("Erreur getHistoryMissions", error);
      return [];
    }
  },

  // --- FAVOURITES MANAGEMENT ---

  /**
   * Retrieve my favourite assignments
   * GET /volunteers/me/favorites
   */
  getFavorites: async (): Promise<Mission[]> => {
    try {
      const { data } = await api.get<any[]>('/volunteers/me/favorites');
      return data.map(mapApiToMission);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Add a mission to favourites
   * POST /volunteers/me/favorites/${missionId}
   */
  addFavorite: async (missionId: number): Promise<void> => {
    try {
      await api.post(`/volunteers/me/favorites/${missionId}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Remove a mission from favourites
   * DELETE /volunteers/me/favorites/${missionId}
   */
  removeFavorite: async (missionId: number): Promise<void> => {
    try {
      await api.delete(`/volunteers/me/favorites/${missionId}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // --- Application Management ---

  /**
   * Apply for an assignment
   * POST /volunteers/me/missions/${missionId}/apply
   */
  applyToMission: async (missionId: number, message?: string): Promise<void> => {
    try {
      await api.post(
        `/volunteers/me/missions/${missionId}/apply`,
        { message }
      );
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Withdraw from a mission
   * DELETE /volunteers/me/missions/${missionId}/application
   */
  withdrawApplication: async (missionId: number): Promise<void> => {
    try {
      await api.delete(`/volunteers/me/missions/${missionId}/application`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

};