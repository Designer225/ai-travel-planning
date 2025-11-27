'use server'

import SiteUser from "@/types";
import { cookies } from "next/headers";

let mockUser : SiteUser | null = null;

export async function getCurrentUser() {
    console.log('getCurrentUser():', await cookies());
    return mockUser;
}

export async function login(email: string, passHashed: string) {
    console.log('login():', await cookies());
    // mock placeholder code, replace when full login mechanism is ready
    var currentUser = await getCurrentUser();
    if (currentUser === null) {
        mockUser = {
            id: 0,
            firstName: "John",
            lastName: "Smith",
            bio: "Travel Enthusiast",
            email: "john.smith@gmail.com",
            location: "San Francisco, CA",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
        };
        return mockUser;
    } else return currentUser;
}

export async function logout() {
    console.log('logout():', await cookies());
    mockUser = null;
}

export async function copyItinerary(tripId: number) {
    console.log('copyItinerary():', await cookies());
    // clone the itinerary and set it as primary
}

export async function setCurrentItinerary(tripId: number) {
    console.log('setCurrentItinerary():', await cookies());
    // set current itinerary
}

export async function addDestinationToCurrentItinerary(destId: number) {
    console.log('addDestinationToCurrentItinerary():', await cookies());
    // add itinerary to current itinerary
}

export async function getCurrentItineraryId() : Promise<number | undefined> {
    console.log('getCurrentItineraryId():', await cookies());
    return 1;
}

export async function getCurrentItinerary() {
    console.log('getCurrentItinerary():', await cookies());
}

export async function getUserTrips() {
    console.log('getUserTrips():', await cookies());
}
