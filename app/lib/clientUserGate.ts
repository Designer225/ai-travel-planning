'use client'

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getCurrentUser, login, logout } from "./sessionControl"
import { Destination, TripPlan } from "@/types";

// Use this to login, 
export async function tryEnterDashboard(router: AppRouterInstance) {
    let currentUser = await getCurrentUser();
    if (currentUser === null) {
        // placeholder function, replace with login page when it exists
        await tryLogin('john.smith@gmail.com', '2ab34e1f', router);
    } else router.push('/dashboard');
}

export async function tryGetCurrentUser(router: AppRouterInstance) {
    return await getCurrentUser();
}

export async function tryLogin(email: string, passHashed: string, router: AppRouterInstance) {
    await login(email, passHashed);
    router.push('/dashboard');
}

export async function tryLogout(router: AppRouterInstance) {
    await logout();
    if (window.location.pathname == '/') window.location.reload();
    else router.push('/');
}

export async function tryCopyItinerary(tripId: number, router: AppRouterInstance) {
    if (await getCurrentUser() === null) await tryLogout(router);
    else {
        // clone the itinerary and open the builder
        router.push('/itinerary-builder');
    }
}

export async function tryEnterItineraryBuilder(router: AppRouterInstance, destId?: number, tripId?: number) {
    if (await getCurrentUser() === null) await tryLogout(router);
    else {
        // fetch the previous itinerary and add it, again replace this placeholder code
        router.push('/itinerary-builder')
    }
}

export async function tryEnterMapExplorer(router: AppRouterInstance) {
    if (await getCurrentUser() === null) await tryLogout(router);
    else {
        // fetch the user and open map explorer
        router.push('/map-explore');
    }
}

export async function tryEnterMyTrips(router: AppRouterInstance) {
    if (await getCurrentUser() === null) await tryLogout(router);
    else {
        // fetch the user and open the page for that user
        router.push('/my-trips');
    }
}

export async function tryCheckout(tripPlan: TripPlan, router: AppRouterInstance) {
    if (await getCurrentUser() === null) await tryLogout(router);
    else {
        // upload trip data or something
        router.push('/checkout');
    }
}