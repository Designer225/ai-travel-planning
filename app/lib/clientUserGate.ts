import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getCurrentUser, login, logout } from "./sessionControl";
import { setCurrentItinerary, clearCurrentItinerary, addDestinationToCurrentItinerary } from "./itineraryActions";
import { TripPlan } from "@/types";

export async function tryEnterDashboard(router: AppRouterInstance) {
    let currentUser = await getCurrentUser();
    if (currentUser === undefined) {
        // placeholder function, replace with login page when it exists
        await tryLogin('john.smith@gmail.com', 'password123', router);
    } else router.push('/dashboard');
}

export async function tryGetCurrentUser(router: AppRouterInstance) {
    return await getCurrentUser();
}

export async function tryLogin(email: string, password: string, router: AppRouterInstance) {
    const result = await login(email, password);
    if (result.success) {
        router.push('/dashboard');
    } else {
        // Handle login error - could show toast or redirect to login page
        console.error('Login failed:', result.error);
    }
}

export async function tryLogout(router: AppRouterInstance) {
    await logout();
    if (typeof window !== 'undefined' && window.location.pathname == '/') window.location.reload();
    else router.push('/');
}

export async function tryCopyItinerary(tripId: number, router: AppRouterInstance) {
    if (await getCurrentUser() === undefined) await tryLogout(router);
    else {
        // Copy trip is handled in TripsList component now
        router.push('/itinerary-builder');
    }
}

export async function tryEnterItineraryBuilder(router: AppRouterInstance, destId?: number, tripId?: number) {
    if (await getCurrentUser() === undefined) await tryLogout(router);
    else {
        if (tripId !== undefined) {
            await setCurrentItinerary(tripId);
        } else if (destId !== undefined) {
            // destId is a destination ID, we need to get the destination name
            // For now, we'll create a placeholder - this should be enhanced
            await addDestinationToCurrentItinerary(`Destination ${destId}`);
        } else {
            // Explicitly clear any previously selected itinerary so we start a blank trip
            await clearCurrentItinerary();
        }
        router.push('/itinerary-builder')
    }
}

export async function tryEnterMapExplorer(router: AppRouterInstance) {
    if (await getCurrentUser() === undefined) await tryLogout(router);
    else {
        // fetch the user and open map explorer
        router.push('/map-explore');
    }
}

export async function tryEnterMyTrips(router: AppRouterInstance) {
    if (await getCurrentUser() === undefined) await tryLogout(router);
    else {
        // fetch the user and open the page for that user
        router.push('/my-trips');
    }
}

export async function tryCheckout(tripPlan: TripPlan, router: AppRouterInstance) {
    if (await getCurrentUser() === undefined) await tryLogout(router);
    else {
        // upload trip data or something
        router.push('/checkout');
    }
}