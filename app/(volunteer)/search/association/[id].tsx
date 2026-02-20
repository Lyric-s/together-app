/**
 * @file [id].tsx
 * @description Dynamic route to view association details as a volunteer.
 * Chemin: app/(volunteer)/search/association/[id].tsx
 */

import AboutUsAssociation from '@/pages/AboutUsAssociation';

/**
 * Render the volunteer-facing association details page.
 *
 * @returns A JSX element containing the AboutUsAssociation page component.
 */
export default function VolunteerAssociationDetailsRoute() {
  return <AboutUsAssociation />;
}