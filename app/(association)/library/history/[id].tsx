/**
 * @file [id].tsx
 * @description Dynamic route to view mission details as a volunteer.
 * Chemin: app/(volunteer)/search/mission/[id].tsx
 */

import JoinMission from '@/pages/JoinMission';

/**
 * Render the JoinMission page for a volunteer viewing mission details.
 *
 * @returns A JSX element that renders the mission join/details UI for users.
 */
export default function AssosPreviousMission() {
  return <JoinMission />;
}