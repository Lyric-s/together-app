/**
 * @file [id].tsx
 * @description Dynamic route to view mission details as a guest.
 * Chemin: app/(guest)/search/mission/[id].tsx
 */

import JoinMission from '@/pages/JoinMission';

/**
 * Render the JoinMission page for a guest viewing mission details.
 *
 * @returns A JSX element that renders the mission join/details UI for guest users.
 */
export default function GuestMissionDetailsRoute() {
  return <JoinMission />;
}