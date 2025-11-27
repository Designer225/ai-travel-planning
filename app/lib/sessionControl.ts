'use server'

import SiteUser from "@/types";

let mockUser : SiteUser | null = null;

export async function getCurrentUser() {
    return mockUser;
}

export async function login(email: string, passHashed: string) {
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
    mockUser = null;
}