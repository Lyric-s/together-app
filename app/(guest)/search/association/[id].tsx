/**
 * @file [id].tsx
 * @description Dynamic route to view association details as a guest.
 * Chemin: app/(guest)/search/association/[id].tsx
 */

import AboutUsAssociation from '@/pages/AboutUsAssociation';

/**
 * Render the guest-facing association details page.
 *
 * @returns A JSX element containing the AboutUsAssociation page component.
 */
export default function GuestAssociationDetailsRoute() {
  return <AboutUsAssociation />;
}