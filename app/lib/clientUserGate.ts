'use client'

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getCurrentUser, login, logout } from "./sessionControl"

export async function tryEnterDashboard(router: AppRouterInstance) {
    let currentUser = await getCurrentUser();
    if (currentUser === null) {
        currentUser = await login('john.smith@gmail.com', '2ab34e1f');
    }
    router.push('/dashboard');
}

export async function tryGetCurrentUser(router: AppRouterInstance) {
    return await getCurrentUser();
}

export async function tryLogout(router: AppRouterInstance) {
    await logout();
    if (window.location.pathname == '/') window.location.reload();
    else router.push('/');
}