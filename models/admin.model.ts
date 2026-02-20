/**
 * Admin-related data models.
 * These interfaces define the shape of admin data received from the API
 * and the payloads sent when creating or updating an admin account.
 */

export interface Admin {
  id_admin: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

export interface AdminCreate {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
}

export interface AdminUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

/* =======================
   INTERNAL ADMIN TYPES
======================= */

export type ApiVerifState = "PENDING" | "APPROVED" | "REJECTED";

export type DocumentPublic = {
  doc_name: string;
  url_doc: string | null;
  date_upload: string; // ISO
  verif_state: ApiVerifState;
  rejection_reason?: string | null;
  id_admin: number | null;
  id_asso: number;
  id_doc: number;
};

export type AssociationPublic = {
  id_asso: number;
  name: string;
  rna_code: string;
  verification_status: ApiVerifState;
};

export type ReportProcessingState = "PENDING" | "APPROVED" | "REJECTED";
export type ReportTarget = "PROFILE" | "MISSION" | "ASSOCIATION" | string;
export type ReportCategory = string;

export interface ReportPublic {
  id_report: number;
  type: ReportCategory;          // ex: "HARASSMENT"
  target: ReportTarget;          // ex: "PROFILE"
  reason: string;
  id_user_reported: number;
  state: ReportProcessingState;  // PENDING/APPROVED/REJECTED
  date_reporting: string;        // ISO
  reporter_name: string;
  reported_name: string;
}

export type ReportStatsResponse = Record<string, number>;

export interface GetReportsParams {
  offset?: number;
  limit?: number;
}

export type MonthlyDataPoint = {
  month: string; // "YYYY-MM"
  value: number;
};

export type OverviewStatsResponse = {
  total_validated_associations: number;
  total_completed_missions: number;
  total_users: number;
  pending_reports_count: number;
  pending_associations_count: number;
};

/* =======================
   NORMALIZERS / HELPERS
======================= */

export function formatMonthLabel(yyyyMm: string): string {
  const parts = yyyyMm.split("-");
  if (parts.length !== 2) return yyyyMm;

  const monthNum = Number(parts[1]);
  const labels = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
  ];

  return labels[monthNum - 1] ?? yyyyMm;
}

export function normalizeMonthlyData(data: MonthlyDataPoint[]) {
  return data.map((item) => ({
    month: formatMonthLabel(item.month),
    value: item.value,
  }));
}
