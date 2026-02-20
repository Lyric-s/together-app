// app/(guest)/profile/index.tsx
import React from 'react';
import ActivityGuest from '@/pages/ActivityGuest';
/**
 * Renders the guest activity route.
 *
 * @returns The ActivityGuest JSX element shown to unauthenticated users for login or registration.
 */

export default function ActivityGuestPage() {
    return <ActivityGuest />;
}