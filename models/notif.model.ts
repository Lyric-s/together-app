/**
 * Notification model
 * Represents notifications sent to associations
 */

export type NotificationType =
  | 'volunteer_joined'
  | 'volunteer_approved'
  | 'volunteer_rejected'
  | 'mission_updated'
  | 'mission_deleted'
  | string; // fallback 

export interface Notification {
  id_notification: number;
  notification_type: NotificationType;
  message: string;
  related_mission_id: number | null;
  related_user_id: number | null;
  is_read: boolean;
  created_at: string; // ISO date string
}
