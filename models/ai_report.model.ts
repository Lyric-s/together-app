import { ProcessingStatus, ReportTarget, AIContentCategory } from "./enums";

/**
 * AI Report data models.
 * Represents reports generated automatically by the AI content moderation system,
 * including their classification, confidence score, and processing state.
 */

export interface AIReport {
  id_report: number;
  target: ReportTarget;
  target_id: number;
  id_user_reported: number;
  classification: AIContentCategory;
  confidence_score?: number;
  model_version: string;
  state: ProcessingStatus;
  created_at: string;
}

export interface AIReportUpdate {
  state: ProcessingStatus;
}

export interface GetAIReportsParams {
  offset?: number;
  limit?: number;
}
