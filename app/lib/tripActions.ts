'use server'

import { prisma } from './prisma';
import { getCurrentUser } from './sessionControl';
import { TripPlan, TripDay, DayActivity } from '@/types';
import { TripStatus, ActivityCategory } from '@prisma/client';

// Helper function to convert database trip to TripPlan format
function dbTripToTripPlan(trip: any): TripPlan {
  const days: TripDay[] = trip.days
    .sort((a: any, b: any) => a.dayNumber - b.dayNumber)
    .map((day: any) => ({
      day: day.dayNumber,
      date: day.date || undefined,
      title: day.title,
      activities: day.activities
        .sort((a: any, b: any) => {
          // First sort by order, then by time
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          const timeA = a.time || '00:00';
          const timeB = b.time || '00:00';
          return timeA.localeCompare(timeB);
        })
        .map((activity: any) => ({
          id: activity.id.toString(),
          time: activity.time || '00:00',
          title: activity.title,
          description: activity.description,
          location: activity.location || undefined,
          category: activity.category as DayActivity['category'],
        })),
    }));

  return {
    title: trip.title || undefined,
    destination: trip.destination,
    startDate: trip.startDate ? trip.startDate.toISOString().split('T')[0] : undefined,
    endDate: trip.endDate ? trip.endDate.toISOString().split('T')[0] : undefined,
    days,
    budget: trip.budget || undefined,
    travelers: trip.travelers || undefined,
  };
}

export async function createTrip(
  title: string,
  destination: string,
  startDate?: string,
  endDate?: string
): Promise<{ success: boolean; tripId?: number; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        title,
        destination,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: TripStatus.SAVED,
      },
    });

    return { success: true, tripId: trip.id };
  } catch (error) {
    console.error('Create trip error:', error);
    return { success: false, error: "Failed to create trip" };
  }
}

export async function getUserTrips(status?: 'upcoming' | 'past' | 'saved') {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated", trips: [] };
    }

    let statusFilter: TripStatus | undefined;
    if (status === 'upcoming') {
      statusFilter = TripStatus.UPCOMING;
    } else if (status === 'past') {
      statusFilter = TripStatus.PAST;
    } else if (status === 'saved') {
      statusFilter = TripStatus.SAVED;
    }

    const where: any = { userId: user.id };
    if (statusFilter) {
      where.status = statusFilter;
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        days: {
          include: {
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert to frontend format
    const formattedTrips = trips.map((trip) => {
      const totalActivities = trip.days.reduce(
        (sum, day) => sum + day.activities.length,
        0
      );

      return {
        id: trip.id,
        title: trip.title || trip.destination,
        destination: trip.destination,
        dateRange: trip.startDate && trip.endDate
          ? `${trip.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${trip.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          : undefined,
        tripTime: trip.startDate && trip.endDate
          ? `${Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
          : 'TBD',
        activities: totalActivities,
        imageUrl: trip.imageUrl || '',
      };
    });

    return { success: true, trips: formattedTrips };
  } catch (error) {
    console.error('Get user trips error:', error);
    return { success: false, error: "Failed to fetch trips", trips: [] };
  }
}

export async function getTripById(tripId: number): Promise<{ success: boolean; tripPlan?: TripPlan; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id, // Ensure user owns the trip
      },
      include: {
        days: {
          include: {
            activities: {
              orderBy: {
                time: 'asc',
              },
            },
          },
          orderBy: {
            dayNumber: 'asc',
          },
        },
      },
    });

    if (!trip) {
      return { success: false, error: "Trip not found" };
    }

    const tripPlan = dbTripToTripPlan(trip);
    return { success: true, tripPlan };
  } catch (error) {
    console.error('Get trip by id error:', error);
    return { success: false, error: "Failed to fetch trip" };
  }
}

export async function updateTrip(
  tripId: number,
  data: {
    title?: string;
    destination?: string;
    startDate?: string;
    endDate?: string;
    budget?: string;
    travelers?: number;
    status?: 'upcoming' | 'past' | 'saved';
    imageUrl?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.destination !== undefined) updateData.destination = data.destination;
    if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.travelers !== undefined) updateData.travelers = data.travelers;
    if (data.status !== undefined) {
      updateData.status = data.status.toUpperCase() as TripStatus;
    }
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    // First verify the trip exists and belongs to user
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id,
      },
    });

    if (!existingTrip) {
      return { success: false, error: "Trip not found" };
    }

    // Use update instead of updateMany for better error handling
    await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    console.error('Update trip error:', error);
    return { success: false, error: "Failed to update trip" };
  }
}

export async function deleteTrip(tripId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    await prisma.trip.deleteMany({
      where: {
        id: tripId,
        userId: user.id, // Ensure user owns the trip
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Delete trip error:', error);
    return { success: false, error: "Failed to delete trip" };
  }
}

export async function copyTrip(tripId: number): Promise<{ success: boolean; newTripId?: number; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get original trip
    const originalTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id,
      },
      include: {
        days: {
          include: {
            activities: true,
          },
        },
      },
    });

    if (!originalTrip) {
      return { success: false, error: "Trip not found" };
    }

    // Create new trip
    const newTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        title: `${originalTrip.title} (Copy)`,
        destination: originalTrip.destination,
        startDate: originalTrip.startDate,
        endDate: originalTrip.endDate,
        budget: originalTrip.budget,
        travelers: originalTrip.travelers,
        status: TripStatus.SAVED,
        imageUrl: originalTrip.imageUrl,
      },
    });

    // Copy days and activities
    for (const day of originalTrip.days) {
      const newDay = await prisma.tripDay.create({
        data: {
          tripId: newTrip.id,
          dayNumber: day.dayNumber,
          date: day.date,
          title: day.title,
        },
      });

      // Copy activities
      for (const activity of day.activities) {
        await prisma.dayActivity.create({
          data: {
            tripDayId: newDay.id,
            time: activity.time,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            category: activity.category as ActivityCategory,
          },
        });
      }
    }

    return { success: true, newTripId: newTrip.id };
  } catch (error) {
    console.error('Copy trip error:', error);
    return { success: false, error: "Failed to copy trip" };
  }
}

export async function saveItinerary(
  tripId: number,
  tripPlan: TripPlan
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify trip exists and belongs to user
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id,
      },
    });

    if (!existingTrip) {
      return { success: false, error: "Trip not found" };
    }

    // Update trip basic info
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        title: tripPlan.title || tripPlan.destination, // Use title if provided, otherwise use destination
        destination: tripPlan.destination,
        startDate: tripPlan.startDate ? new Date(tripPlan.startDate) : null,
        endDate: tripPlan.endDate ? new Date(tripPlan.endDate) : null,
        budget: tripPlan.budget || null,
        travelers: tripPlan.travelers || null,
      },
    });

    // Delete existing days and activities (cascade will handle activities)
    await prisma.tripDay.deleteMany({
      where: { tripId },
    });

    // Create new days and activities
    for (const day of tripPlan.days) {
      const tripDay = await prisma.tripDay.create({
        data: {
          tripId,
          dayNumber: day.day,
          date: day.date || null,
          title: day.title,
        },
      });

      for (let index = 0; index < day.activities.length; index++) {
        const activity = day.activities[index];
        await prisma.dayActivity.create({
          data: {
            tripDayId: tripDay.id,
            time: activity.time,
            title: activity.title,
            description: activity.description,
            location: activity.location || null,
            category: activity.category as ActivityCategory,
            order: index, // Preserve order within day
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Save itinerary error:', error);
    return { success: false, error: "Failed to save itinerary" };
  }
}
