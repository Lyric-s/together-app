// services/documentService.ts
import api from './api'; // Votre instance axios configurée
import { AxiosError } from 'axios';
import { Platform } from 'react-native';

export interface DocumentResponse {
  id_doc: number;
  doc_name: string;
  url_doc: string;
  id_asso: number;
  verif_state: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason: string | null;
  date_uploaded: string;
}

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
  file?: File; // Web specific (File object from input)
}

export const documentService = {
    
    uploadValidationDocument: async (file: PickedFile, docName: string): Promise<DocumentResponse> => {
        try {
            const formData = new FormData();
            formData.append('doc_name', docName);

            if (Platform.OS === 'web') {
                if (file.file) {
                    // If we have the direct File object (standard on Web)
                    formData.append('file', file.file);
                } else {
                    // Fallback: fetch blob from URI (blob:...)
                    const response = await fetch(file.uri);
                    const blob = await response.blob();
                    formData.append('file', blob, file.name || 'document.pdf');
                }
            } else {
                // Mobile (React Native polyfill)
                const filePayload = {
                    uri: file.uri,
                    name: file.name || 'document_upload.pdf',
                    type: file.mimeType || 'application/pdf',
                };
                formData.append('file', filePayload as any);
            }

            const response = await api.post<DocumentResponse>('/documents/upload', formData);

            return response.data;

        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("❌ Upload Error:", axiosError.response?.data || axiosError.message);
            throw error;
        }
    }
};