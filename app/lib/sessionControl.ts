'use server'

import SiteUser from "@/types";
import { cookies } from "next/headers";
import { getIronSession } from 'iron-session';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

type SessionData = {
    user?: SiteUser;
}

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
}

const SESSION_SECRET = process.env.SESSION_SECRET;

async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), {
        password: SESSION_SECRET,
        cookieName: "ai-travel-planning",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        },
    });
    return session;
}

export async function getCurrentUser(): Promise<SiteUser | undefined> {
    const session = await getSession();
    return session.user;
}

export async function updateSessionUser(user: SiteUser): Promise<void> {
    const session = await getSession();
    session.user = user;
    await session.save();
}

export async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
): Promise<{ success: boolean; user?: SiteUser; error?: string }> {
    try {
        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return { success: false, error: "All fields are required" };
        }

        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters" };
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                bio: "",
                location: "",
                avatarUrl: "",
            },
        });

        // Create session
        const session = await getSession();
        session.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            email: user.email,
            location: user.location,
            avatarUrl: user.avatarUrl,
        };
        await session.save();

        return { success: true, user: session.user };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: "Failed to create account" };
    }
}

export async function login(
    email: string,
    password: string
): Promise<{ success: boolean; user?: SiteUser; error?: string }> {
    try {
        // Validate input
        if (!email || !password) {
            return { success: false, error: "Email and password are required" };
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { success: false, error: "Invalid email or password" };
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return { success: false, error: "Invalid email or password" };
        }

        // Create session
        const session = await getSession();
        session.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            email: user.email,
            location: user.location,
            avatarUrl: user.avatarUrl,
        };
        await session.save();

        return { success: true, user: session.user };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: "Failed to login" };
    }
}

export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect('/');
}

// Note: copyItinerary, setCurrentItinerary, addDestinationToCurrentItinerary,
// getCurrentItineraryId, getCurrentItinerary, and getUserTrips have been moved to:
// - tripActions.ts (getUserTrips, copyTrip)
// - itineraryActions.ts (setCurrentItinerary, getCurrentItineraryId, getCurrentItinerary, addDestinationToCurrentItinerary)
