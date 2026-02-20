import { Engagement } from '@/models/engagement.model';
import api from './api';
import { Association, AssociationCreate, AssociationUpdate } from '@/models/association.model';
import { Mission, MissionCreate, MissionPublic, MissionUpdate } from '@/models/mission.model';
import { Notification } from '@/models/notif.model';
import { UserCreate } from '@/models/user.model';
import { handleApiError } from '@/services/apiErrorHandler';
import { ProcessingStatus } from '@/models/enums';
import { VolunteerPublic, VolunteerStatus } from '@/models/volunteer.model';

export const associationService = {

  // GET /associations/
  getAll: async (): Promise<Association[]> => {
    try {
      const { data } = await api.get<Association[]>('/associations/');
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // GET /associations/{id}
  getById: async (id: number): Promise<Association> => {
    try {
      const { data } = await api.get<Association>(`/associations/${id}`);
      return data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // GET /associations/me
  getMe: async (): Promise<Association> => {
    try {
      const { data } = await api.get<Association>('/associations/me');
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // POST /associations/
  create: async (userIn: UserCreate, associationIn: AssociationCreate): Promise<Association> => {
    try {
      const { data } = await api.post<Association>('/associations/', {
        user_in: userIn,
        association_in: associationIn,
      });
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // PATCH /associations/{id}
  update: async (id: number, payload: AssociationUpdate): Promise<Association> => {
    try {
      const { data } = await api.patch<Association>(`/associations/${id}`, payload);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // DELETE /associations/{id}
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/associations/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },
  
  // GET /associations/me/missions
  getMyMissions: async (): Promise<MissionPublic[]> => {
    try {
      const { data } = await api.get<MissionPublic[]>('/associations/me/missions');
      return data;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  },

  /**
   * Retrieve only finished missions (date_end in the past).
   */
  getMyFinishedMissions: async (): Promise<MissionPublic[]> => {
  try {
    const response = await api.get<MissionPublic[]>('/associations/me/missions');
    const missions = response.data; 

    const today = new Date();

    const finishedMissions = missions.filter((m) => {
      const endDate = new Date(m.date_end);
      return endDate < today;
    });

    return finishedMissions;
  } catch (error) {
    handleApiError(error);
    return [];
  }
},


  // POST /associations/me/missions
  createMission: async (payload: MissionCreate): Promise<Mission> => {
    try {
      const { data } = await api.post<Mission>('/associations/me/missions', payload);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // PATCH /associations/me/missions/{id}
  updateMission: async (id: number, payload: MissionUpdate): Promise<Mission> => {
    try {
      const { data } = await api.patch<Mission>(`/associations/me/missions/${id}`, payload);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // DELETE /associations/me/missions/{id}
  deleteMission: async (id: number): Promise<void> => {
    try {
      await api.delete(`/associations/me/missions/${id}`);
    } catch (error) {
      handleApiError(error);
    }
  },

  // GET /associations/notifications
  getNotifications: async (offset: number, limit: number, unread_only?: boolean): 
    Promise<Notification[]> => {
      try {
        const { data } = await api.get<Notification[]>(`/associations/notifications`, 
          {
            params: {
              unread_only,
              offset,
              limit,
            },
          }
        );
        return data;
      } catch (error) {
        handleApiError(error);
      }
  },

  // PATCH /associations/me/engagements/{volunteer_id}/{mission_id}/approve
  approveEngagement: async (volunteerId: number, missionId: number
  ): Promise<Engagement> => {
    try {
      const { data } = await api.patch<Engagement>(
        `/associations/me/engagements/${volunteerId}/${missionId}/approve`
      );
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // PATCH /associations/me/engagements/{volunteer_id}/{mission_id}/reject
  rejectEngagement: async (
    volunteerId: number,
    missionId: number,
    rejectionReason: string
  ): Promise<Engagement> => {
    try {
      const { data } = await api.patch<Engagement>(
        `/associations/me/engagements/${volunteerId}/${missionId}/reject`,
        {
          rejection_reason: rejectionReason,
        }
      );
      return data;
    } catch (error) {
      handleApiError(error);
    }
  },

    /**
   * Récupère tous les engagements pour une mission de l'association connectée
   * @param missionId - ID de la mission
   * @param status - Filtrer par état facultatif ('PENDING', 'APPROVED', 'REJECTED')
   * @returns Liste des engagements
   */
  getMissionEngagements: async (
    missionId: number,
    status?: ProcessingStatus
  ): Promise<VolunteerStatus[]> => {
    try {
      const params = status ? { status } : {};
      const { data } = await api.get<VolunteerStatus[]>(
        `/associations/me/missions/${missionId}/engagements`,
        { params }
      );
      return data;
    } catch (error) {
      handleApiError(error);
      return []; // fallback en cas d'erreur
    }
  },


};