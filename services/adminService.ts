import api from './api';
import { AxiosError } from 'axios';
import { Volunteer,} from '@/models/volunteer.model';
import {
    Admin,
    AdminCreate,
    AdminUpdate,
    DocumentPublic,
    AssociationPublic,
    GetReportsParams,
    ReportPublic,
    ReportProcessingState,
    ReportStatsResponse,
    MonthlyDataPoint,
    OverviewStatsResponse,
    formatMonthLabel,
} from '@/models/admin.model';


/**
 * Normalize and rethrow API errors as user-friendly Error instances.
 *
 * Processes the provided error; if it is an AxiosError, extracts a backend message
 * from `response.data.detail`, `response.data.message`, or `error.message` (falling
 * back to a default French message), logs that message to the console, and throws
 * a new Error with the message. For non-Axios errors, throws a generic French
 * connection error.
 *
 * @param error - The thrown error to normalize and rethrow
 * @throws An Error containing the extracted backend message for Axios errors, or a generic connection error for other error types
 */
function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    // Attempts to retrieve the error message from the backend (FastAPI/Django/Node)
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Une erreur inconnue est survenue.";
    
    console.error("API Error:", message);
    throw new Error(message);
  }
  throw new Error("Erreur inattendue de connexion.");
}

// --- Service ---

export const adminService = {
  // Retrieve MY profile
  // GET /admin/me
  getMe: async (): Promise<Admin> => {
    try {
      const response = await api.get('/admin/me');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update MY profile
  // PATCH /admin/{adminId}
  updateProfile: async (adminId: number, data: AdminUpdate) => {
    try {
      const response = await api.patch(`/admin/${adminId}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * List all volunteers (Paginate)
   * GET /volunteers/
   */
  getAllVolunteers: async (offset = 0, limit = 100): Promise<Volunteer[]> => {
      try {
      const { data } = await api.get<Volunteer[]>('/volunteers/', {
          params: { offset, limit }
      });
      return data;
      } catch (error) {
      handleApiError(error);
      }
  },
    // GET /internal/admin/documents
    getAllDocuments: async (offset = 0, limit = 100): Promise<DocumentPublic[]> => {
        try {
            const { data } = await api.get<DocumentPublic[]>('/internal/admin/documents', {
                params: { offset, limit },
            });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // POST /internal/admin/documents/{document_id}/approve
    approveDocument: async (documentId: number): Promise<DocumentPublic> => {
        try {
            const { data } = await api.post<DocumentPublic>(
                `/internal/admin/documents/${documentId}/approve`
            );
            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // POST /internal/admin/documents/{document_id}/reject
    rejectDocument: async (
        documentId: number,
        rejectionReason?: string
    ): Promise<DocumentPublic> => {
        try {
            const body = rejectionReason ? { rejection_reason: rejectionReason } : {};
            const { data } = await api.post<DocumentPublic>(
                `/internal/admin/documents/${documentId}/reject`,
                body
            );
            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // ==========================
    // ASSOCIATIONS (INTERNAL ADMIN)
    // ==========================

    // GET /internal/admin/associations
    getAllAssociationsInternal: async (): Promise<AssociationPublic[]> => {
        try {
            const { data } = await api.get<AssociationPublic[]>(
                '/internal/admin/associations'
            );
            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // ==========================
    // REPORTS (INTERNAL ADMIN)
    // ==========================

    // GET /internal/admin/reports
    getReports: async (params: GetReportsParams = {}): Promise<ReportPublic[]> => {
        try {
            const { offset = 0, limit = 100 } = params;
            const { data } = await api.get<ReportPublic[]>("/internal/admin/reports", {
                params: { offset, limit },
            });
            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // PATCH /internal/admin/reports/{report_id}
    updateReportState: async (
        reportId: number,
        state: ReportProcessingState
    ): Promise<ReportPublic> => {
        try {
            const { data } = await api.patch<ReportPublic>(
                `/internal/admin/reports/${reportId}`,
                { state }
            );
            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // GET /internal/admin/reports/stats
    getReportStats: async (): Promise<ReportStatsResponse> => {
        try {
            const { data } = await api.get<ReportStatsResponse>(
                "/internal/admin/reports/stats"
            );

            // Swagger bug: parfois "string"
            if (typeof data === "string") {
                throw new Error("Réponse invalide pour /internal/admin/reports/stats");
            }

            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // ==========================
    // DASHBOARD – STATS
    // ==========================

    // GET /internal/admin/stats/overview
    getDashboardOverview: async (): Promise<OverviewStatsResponse> => {
        try {
            const { data } = await api.get<OverviewStatsResponse>(
                "/internal/admin/stats/overview"
            );

            if (typeof data === "string") {
                throw new Error("Réponse invalide pour /internal/admin/stats/overview");
            }

            return data;
        } catch (error) {
            handleApiError(error);
        }
    },

    // GET /internal/admin/stats/volunteers-by-month
    getVolunteersByMonth: async (months = 7): Promise<MonthlyDataPoint[]> => {
        try {
            const { data } = await api.get<MonthlyDataPoint[]>(
                "/internal/admin/stats/volunteers-by-month",
                { params: { months } }
            );

            if (typeof data === "string") {
                throw new Error("Réponse invalide pour /internal/admin/stats/volunteers-by-month");
            }

            return data.map((item) => ({
                month: formatMonthLabel(item.month),
                value: item.value,
            }));
        } catch (error) {
            handleApiError(error);
        }
    },

    // GET /internal/admin/stats/missions-by-month
    getMissionsByMonth: async (months = 7): Promise<MonthlyDataPoint[]> => {
        try {
            const { data } = await api.get<MonthlyDataPoint[]>(
                "/internal/admin/stats/missions-by-month",
                { params: { months } }
            );

            if (typeof data === "string") {
                throw new Error("Réponse invalide pour /internal/admin/stats/missions-by-month");
            }

            return data.map((item) => ({
                month: formatMonthLabel(item.month),
                value: item.value,
            }));
        } catch (error) {
            handleApiError(error);
        }
    },

    getDashboardStats: async (
        months = 7
    ): Promise<{
        associationsCount: number;
        completedMissionsCount: number;
        usersCount: number;
        volunteersPerMonth: MonthlyDataPoint[];
        missionsPerMonth: MonthlyDataPoint[];
        pendingReportsCount: number;
        pendingAssociationsCount: number;
    }> => {
        try {
            const [overview, volunteers, missions] = await Promise.all([
                adminService.getDashboardOverview(),
                adminService.getVolunteersByMonth(months),
                adminService.getMissionsByMonth(months),
            ]);

            return {
                associationsCount: overview.total_validated_associations,
                completedMissionsCount: overview.total_completed_missions,
                usersCount: overview.total_users,
                pendingReportsCount: overview.pending_reports_count,
                pendingAssociationsCount: overview.pending_associations_count,
                volunteersPerMonth: volunteers ?? [],
                missionsPerMonth: missions ?? [],
            };
        } catch (error) {
            handleApiError(error);
            return {
                associationsCount: 0,
                completedMissionsCount: 0,
                usersCount: 0,
                volunteersPerMonth: [],
                missionsPerMonth: [],
                pendingReportsCount: 0,
                pendingAssociationsCount: 0,
            };
        }
    },
    // LISTE pending
    getPendingDocuments: async () => {
        const { data } = await api.get("/internal/admin/documents/pending");
        return data;
    },

// PREVIEW (iframe)
    getAdminDocumentPreviewUrl: async (
        documentId: number
    ): Promise<{ preview_url: string; expires_in: number }> => {
        const { data } = await api.get(
            `/internal/admin/documents/${documentId}/preview-url`
        );
        return data;
    },

// DOWNLOAD
    getAdminDocumentDownloadUrl: async (
        documentId: number
    ): Promise<{ download_url: string; expires_in: number }> => {
        const { data } = await api.get(
            `/internal/admin/documents/${documentId}/download-url`
        );
        return data;
    },



};