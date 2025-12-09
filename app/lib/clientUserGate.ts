import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getCurrentUser, login, logout } from "./sessionControl";
import { setCurrentItinerary, clearCurrentItinerary, addDestinationToCurrentItinerary } from "./itineraryActions";
import { TripPlan } from "@/types";

export async function tryEnterDashboard(router: AppRouterInstance) {
    router.push('/dashboard');
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
    router.push('/itinerary-builder');
}

export async function tryEnterItineraryBuilder(router: AppRouterInstance, destId?: number, tripId?: number) {
    if (tripId !== undefined) {
        await setCurrentItinerary(tripId);
    } else if (destId !== undefined) {
        await addDestinationToCurrentItinerary(`Destination ${destId}`);
    } else {
        await clearCurrentItinerary();
    }
    router.push('/itinerary-builder');
}

export async function tryEnterMapExplorer(router: AppRouterInstance) {
    router.push('/map-explore');
}

export async function tryEnterMyTrips(router: AppRouterInstance) {
    router.push('/my-trips');
}

export async function tryCheckout(tripPlan: TripPlan, router: AppRouterInstance) {
    router.push('/checkout');
}