import api from './api';
import { Report, ReportCreate } from '../models/report.model';

export const reportService = {
  /**
   * Envoie un nouveau signalement à la base de données.
   * Endpoint: POST /reports/
   */
  create: async (reportData: ReportCreate): Promise<Report> => {
    try {
      const response = await api.post<Report>('/reports/', reportData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du signalement:", error);
      throw error;
    }
  },

  /**
   * Récupère la liste des signalements effectués par l'utilisateur connecté.
   * Endpoint: GET /reports/me
   */
  getMyReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get<Report[]>('/reports/me');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de mes signalements:", error);
      throw error;
    }
  },

  /**
   * (Admin) Récupère tous les signalements de la plateforme.
   * Endpoint: GET /internal/admin/reports
   */
  getAllReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get<Report[]>('/internal/admin/reports');
      return response.data;
    } catch (error) {
      console.error("Erreur admin lors de la récupération des signalements:", error);
      throw error;
    }
  }
};