'use server'

import SiteUser from "@/types";
import { cookies } from "next/headers";
import { getIronSession } from 'iron-session'

type SessionData = {
    user?: SiteUser;
}

async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), {
        password: "o1~vaK?G%,Uisuy^3yzNyT=G@KC1#%fmM6*].Pgb4ziktL+GjZTaf:.jLP]i+BrsHUovoDG0@)3Ed9+jL]",
        cookieName: "ai-travel-planning",
    });
    return session;
}

export async function getCurrentUser() {
    const session = await getSession();
    console.log('getCurrentUser():', session);
    return session.user;
}

export async function login(email: string, passHashed: string) {
    const session = await getSession();
    console.log('login():', session);
    // mock placeholder code, replace when full login mechanism is ready
    var currentUser = session.user;
    if (currentUser === undefined) {
        session.user = {
            id: 0,
            firstName: "John",
            lastName: "Smith",
            bio: "Travel Enthusiast",
            email: "john.smith@gmail.com",
            location: "San Francisco, CA",
            avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
        };
        await session.save();
        return session.user;
    } else return currentUser;
}

export async function logout() {
    const session = await getSession();
    console.log('logout():', session);
    session.user = undefined;
    await session.save();
}

export async function copyItinerary(tripId: number) {
    const session = await getSession();
    console.log('copyItinerary():', session);
    // clone the itinerary and set it as primary
}

export async function setCurrentItinerary(tripId: number) {
    const session = await getSession();
    console.log('setCurrentItinerary():', session);
    // set current itinerary
}

export async function addDestinationToCurrentItinerary(destId: number) {
    const session = await getSession();
    console.log('addDestinationToCurrentItinerary():', session);
    // add itinerary to current itinerary
}

export async function getCurrentItineraryId() : Promise<number | undefined> {
    const session = await getSession();
    console.log('getCurrentItineraryId():', session);
    return 1;
}

export async function getCurrentItinerary() {
    const session = await getSession();
    console.log('getCurrentItinerary():', session);
}

export async function getUserTrips() {
    const session = await getSession();
    console.log('getUserTrips():', session);
}
