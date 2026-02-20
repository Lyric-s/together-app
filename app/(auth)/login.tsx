// app/(auth)/login.tsx
import React from 'react';
//import LoginMobile from '@/pages/LoginMobile';
//import LoginWeb from '@/pages/LoginWeb';
import Login from '@/pages/Login'

/**
 * Render the application's login screen.
 *
 * Currently returns the shared `Login` component unconditionally; platform-specific selection is disabled.
 *
 * @returns A JSX element containing the login UI
 */
export default function LoginPage() {
    //return Platform.OS === 'web' ? <LoginWeb /> : <LoginMobile />;
    return <Login />
}