import api from './api';
import { handleApiError } from './apiErrorHandler';
import { AIReport, AIReportUpdate, GetAIReportsParams } from '../models/ai_report.model';

/**
 * AI Report service module.
 *
 * This module provides CRUD operations for AI-generated moderation reports.
 * It is primarily used by administrative interfaces to review and manage
 * automatically flagged content.
 */
export const aiReportService = {
  /**
   * Retrieves a single AI report by its unique identifier.
   *
   * @param reportId - The unique identifier of the AI report.
   * @returns A promise that resolves to the found AI report.
   */
  getAIReport: async (reportId: number): Promise<AIReport> => {
    try {
      const { data } = await api.get<AIReport>(`/internal/admin/ai-reports/${reportId}`);
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Retrieves a paginated list of AI reports, ordered by creation date (newest first).
   *
   * @param params - Pagination parameters (offset and limit).
   * @returns A promise that resolves to a list of AI reports.
   */
  getAIReports: async (params: GetAIReportsParams = {}): Promise<AIReport[]> => {
    try {
      const { offset = 0, limit = 100 } = params;
      const { data } = await api.get<AIReport[]>('/internal/admin/ai-reports/', {
        params: { offset, limit }
      });
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Updates the moderation state of an AI report (e.g., APPROVED or REJECTED).
   *
   * @param reportId - The unique identifier of the report to update.
   * @param reportUpdate - The new state data.
   * @returns A promise that resolves to the updated AI report instance.
   */
  updateAIReportState: async (
    reportId: number,
    reportUpdate: AIReportUpdate
  ): Promise<AIReport> => {
    try {
      const { data } = await api.patch<AIReport>(
        `/internal/admin/ai-reports/${reportId}`,
        reportUpdate
      );
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};
