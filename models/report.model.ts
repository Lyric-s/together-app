import { ProcessingStatus, ReportType, ReportTarget } from "./enums";

/**
 * Report data models.
 * Represents reports submitted by users, including their type, target,
 * processing state, and payloads for creation and administrative updates.
 */

export interface Report {
  id_report: number;
  type: ReportType;
  target: ReportTarget;
  reason: string;
  id_user_reported: number;
  state: ProcessingStatus;
  date_reporting: string;
}

export interface ReportCreate {
  type: ReportType;
  target: ReportTarget;
  reason: string;
  id_user_reported: number;
}

export interface ReportUpdate {
  state?: ProcessingStatus;
}
