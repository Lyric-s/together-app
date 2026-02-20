import { ProcessingStatus } from "./enums";

/**
 * Document data models.
 * Represents documents uploaded by associations and their verification state,
 * along with payloads for creating and updating documents.
 */

export interface Document {
  id_doc: number;
  doc_name: string;
  url_doc: string;
  date_upload: string;
  verif_state: ProcessingStatus;
  id_admin?: number;
  id_asso: number;
}

export interface DocumentCreate {
  doc_name: string;
  url_doc: string;
  id_asso: number;
}

export interface DocumentUpdate {
  doc_name?: string;
  url_doc?: string;
  verif_state?: ProcessingStatus;
  id_admin?: number;
}
