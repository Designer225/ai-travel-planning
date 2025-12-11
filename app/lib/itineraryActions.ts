'use server'

import { cookies } from "next/headers";
import { getIronSession } from 'iron-session';
import { prisma } from './prisma';
import { getCurrentUser } from './sessionControl';
import { getTripById } from './tripActions';
import { TripPlan, DayActivity } from '@/types';
import { ActivityCategory } from '@prisma/client';

type SessionData = {
    currentItineraryId?: number;
}

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required');
}

const SESSION_SECRET = process.env.SESSION_SECRET;

async function getItinerarySession() {
    const session = await getIronSession<SessionData>(await cookies(), {
        password: SESSION_SECRET,
        cookieName: "ai-travel-planning-itinerary",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
        },
    });
    return session;
}

export async function getCurrentItineraryId(): Promise<number | undefined> {
    const session = await getItinerarySession();
    return session.currentItineraryId;
}

export async function clearCurrentItinerary(): Promise<void> {
    const session = await getItinerarySession();
    session.currentItineraryId = undefined;
    await session.save();
}

export async function setCurrentItinerary(tripId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Verify trip exists and belongs to user
        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                userId: user.id,
            },
        });

        if (!trip) {
            return { success: false, error: "Trip not found" };
        }

        const session = await getItinerarySession();
        session.currentItineraryId = tripId;
        await session.save();

        return { success: true };
    } catch (error) {
        console.error('Set current itinerary error:', error);
        return { success: false, error: "Failed to set current itinerary" };
    }
}

export async function getCurrentItinerary(): Promise<{ success: boolean; tripPlan?: TripPlan; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        const itineraryId = await getCurrentItineraryId();
        if (!itineraryId) {
            return { success: false, error: "No current itinerary set" };
        }

        return await getTripById(itineraryId);
    } catch (error) {
        console.error('Get current itinerary error:', error);
        return { success: false, error: "Failed to get current itinerary" };
    }
}

export async function addDestinationToCurrentItinerary(
    destinationName: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        const itineraryId = await getCurrentItineraryId();
        if (!itineraryId) {
            // Create a new trip if no current itinerary
            const { id: tripId } = await prisma.trip.create({
                data: {
                    userId: user.id,
                    title: destinationName,
                    destination: destinationName,
                    status: 'SAVED' as any,
                },
            });

            const session = await getItinerarySession();
            session.currentItineraryId = tripId;
            await session.save();

            return { success: true };
        }

        // Update existing trip destination
        await prisma.trip.updateMany({
            where: {
                id: itineraryId,
                userId: user.id,
            },
            data: {
                destination: destinationName,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Add destination to itinerary error:', error);
        return { success: false, error: "Failed to add destination" };
    }
}

export async function updateItineraryDay(
    tripId: number,
    dayNumber: number,
    updates: {
        title?: string;
        date?: string;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Verify trip belongs to user
        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                userId: user.id,
            },
        });

        if (!trip) {
            return { success: false, error: "Trip not found" };
        }

        // Find and update the day
        const day = await prisma.tripDay.findFirst({
            where: {
                tripId,
                dayNumber,
            },
        });

        if (!day) {
            return { success: false, error: "Day not found" };
        }

        await prisma.tripDay.update({
            where: { id: day.id },
            data: {
                title: updates.title !== undefined ? updates.title : day.title,
                date: updates.date !== undefined ? updates.date : day.date,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Update itinerary day error:', error);
        return { success: false, error: "Failed to update day" };
    }
}

export async function updateActivity(
    activityId: number,
    updates: {
        time?: string;
        title?: string;
        description?: string;
        location?: string;
        category?: DayActivity['category'];
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Verify activity belongs to user's trip
        const activity = await prisma.dayActivity.findFirst({
            where: { id: activityId },
            include: {
                tripDay: {
                    include: {
                        trip: true,
                    },
                },
            },
        });

        if (!activity || activity.tripDay.trip.userId !== user.id) {
            return { success: false, error: "Activity not found" };
        }

        await prisma.dayActivity.update({
            where: { id: activityId },
            data: {
                time: updates.time !== undefined ? updates.time : activity.time,
                title: updates.title !== undefined ? updates.title : activity.title,
                description: updates.description !== undefined ? updates.description : activity.description,
                location: updates.location !== undefined ? updates.location : activity.location,
                category: updates.category !== undefined ? (updates.category as ActivityCategory) : activity.category,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Update activity error:', error);
        return { success: false, error: "Failed to update activity" };
    }
}

export async function addActivity(
    tripId: number,
    dayNumber: number,
    activity: Omit<DayActivity, 'id'>
): Promise<{ success: boolean; activityId?: number; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Verify trip belongs to user
        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                userId: user.id,
            },
        });

        if (!trip) {
            return { success: false, error: "Trip not found" };
        }

        // Find the day
        const day = await prisma.tripDay.findFirst({
            where: {
                tripId,
                dayNumber,
            },
        });

        if (!day) {
            return { success: false, error: "Day not found" };
        }

        const newActivity = await prisma.dayActivity.create({
            data: {
                tripDayId: day.id,
                time: activity.time,
                title: activity.title,
                description: activity.description,
                location: activity.location || null,
                category: activity.category as ActivityCategory,
            },
        });

        return { success: true, activityId: newActivity.id };
    } catch (error) {
        console.error('Add activity error:', error);
        return { success: false, error: "Failed to add activity" };
    }
}

export async function deleteActivity(activityId: number): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Verify activity belongs to user's trip
        const activity = await prisma.dayActivity.findFirst({
            where: { id: activityId },
            include: {
                tripDay: {
                    include: {
                        trip: true,
                    },
                },
            },
        });

        if (!activity || activity.tripDay.trip.userId !== user.id) {
            return { success: false, error: "Activity not found" };
        }

        await prisma.dayActivity.delete({
            where: { id: activityId },
        });

        return { success: true };
    } catch (error) {
        console.error('Delete activity error:', error);
        return { success: false, error: "Failed to delete activity" };
    }
}

export async function reorderActivities(
    tripId: number,
    dayNumber: number,
    activityIds: number[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Verify trip belongs to user
        const trip = await prisma.trip.findFirst({
            where: {
                id: tripId,
                userId: user.id,
            },
        });

        if (!trip) {
            return { success: false, error: "Trip not found" };
        }

        // Find the day
        const day = await prisma.tripDay.findFirst({
            where: {
                tripId,
                dayNumber,
            },
        });

        if (!day) {
            return { success: false, error: "Day not found" };
        }

        // Get all activities for this day
        const activities = await prisma.dayActivity.findMany({
            where: { tripDayId: day.id },
        });

        // Verify all activity IDs belong to this day
        const activityMap = new Map(activities.map(a => [a.id, a]));
        for (const id of activityIds) {
            if (!activityMap.has(id)) {
                return { success: false, error: "Invalid activity ID" };
            }
        }

        // Note: Prisma doesn't have built-in ordering, so we'll need to store order
        // For now, we'll rely on time-based sorting in queries
        // If you need explicit ordering, add an `order` field to DayActivity model

        return { success: true };
    } catch (error) {
        console.error('Reorder activities error:', error);
        return { success: false, error: "Failed to reorder activities" };
    }
}

