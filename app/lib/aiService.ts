import { GoogleGenerativeAI } from '@google/generative-ai';
import { TripPlan, TripDay, DayActivity } from '@/types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.');
}

// Initialize Gemini
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Use gemini-2.5-flash-lite for faster responses
const MODEL_NAME = 'gemini-2.5-flash-lite';

export interface GenerateItineraryParams {
  userMessage: string;
  existingTripPlan?: TripPlan | null;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface GenerateItineraryResponse {
  success: boolean;
  responseText: string;
  tripPlan?: TripPlan;
  error?: string;
}

/**
 * Generates a structured travel itinerary using Google Gemini AI
 */
export async function generateItinerary(
  params: GenerateItineraryParams
): Promise<GenerateItineraryResponse> {
  if (!genAI) {
    return {
      success: false,
      responseText: 'AI service is not configured. Please set GEMINI_API_KEY in your environment variables.',
      error: 'API_KEY_NOT_SET',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Build the system prompt
    const systemPrompt = buildSystemPrompt(params.existingTripPlan);

    // Build the user prompt with context
    const userPrompt = buildUserPrompt(
      params.userMessage,
      params.existingTripPlan,
      params.conversationHistory
    );

    // Create a timeout promise (30 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
    });

    // Combine system and user prompts
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Make the API call with timeout
    const generateContentPromise = model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });

    const result = await Promise.race([generateContentPromise, timeoutPromise]);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let parsedResponse: any;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      parsedResponse = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      // Fallback: return the text response without structured data
      return {
        success: true,
        responseText: text || 'I apologize, but I had trouble generating a structured itinerary. Please try rephrasing your request.',
      };
    }

    // Extract response text and trip plan
    const responseText = parsedResponse.responseText || parsedResponse.message || text;
    const tripPlanData = parsedResponse.tripPlan || parsedResponse;

    // Validate and transform the trip plan
    const tripPlan = validateAndTransformTripPlan(tripPlanData, params.existingTripPlan);

    return {
      success: true,
      responseText,
      tripPlan: tripPlan || undefined,
    };
  } catch (error: any) {
    console.error('Error generating itinerary:', error);

    // Handle specific error types
    if (error.message?.includes('timeout')) {
      return {
        success: false,
        responseText: 'The request took too long. Please try again with a simpler request.',
        error: 'TIMEOUT',
      };
    }

    if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      return {
        success: false,
        responseText: 'Invalid API key. Please check your GEMINI_API_KEY configuration.',
        error: 'INVALID_API_KEY',
      };
    }

    if (error.message?.includes('429') || error.message?.includes('rate limit')) {
      return {
        success: false,
        responseText: 'Rate limit exceeded. Please wait a moment and try again.',
        error: 'RATE_LIMIT',
      };
    }

    return {
      success: false,
      responseText: 'I encountered an error while generating your itinerary. Please try again.',
      error: error.message || 'UNKNOWN_ERROR',
    };
  }
}

/**
 * Builds the system prompt for the AI
 */
function buildSystemPrompt(existingTripPlan?: TripPlan | null): string {
  return `You are an expert travel planning assistant. Your role is to help users create detailed, time-aware travel itineraries.

When a user requests a trip plan, you MUST return a JSON object with the following structure:
{
  "responseText": "A friendly, conversational response to the user (2-3 sentences)",
  "tripPlan": {
    "destination": "City, Country",
    "startDate": "YYYY-MM-DD" (optional),
    "endDate": "YYYY-MM-DD" (optional),
    "title": "Trip Title" (optional),
    "budget": "Budget range" (optional),
    "travelers": number (optional),
    "days": [
      {
        "day": 1,
        "date": "Formatted date string" (optional),
        "title": "Day title",
        "activities": [
          {
            "id": "unique-id",
            "time": "HH:MM" (24-hour format),
            "title": "Activity title",
            "description": "Detailed description",
            "location": "Location name" (optional),
            "category": "transport" | "activity" | "food" | "accommodation" | "other"
          }
        ]
      }
    ]
  }
}

IMPORTANT RULES:
1. Activities MUST be in chronological order (sorted by time)
2. Times should be realistic and allow for travel between locations
3. Include a mix of activities: transport, accommodation, food, and activities
4. Each activity must have a unique ID (use simple strings like "1", "2", etc.)
5. If the user is modifying an existing trip, preserve existing days and add/modify as requested
6. Always return valid JSON - no markdown formatting unless the user explicitly asks for it
7. If the user's request doesn't require itinerary changes, only return "responseText" without "tripPlan"

For general questions or conversations that don't require itinerary generation, return:
{
  "responseText": "Your helpful response here"
}`;
}

/**
 * Builds the user prompt with context
 */
function buildUserPrompt(
  userMessage: string,
  existingTripPlan?: TripPlan | null,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): string {
  let prompt = `User message: ${userMessage}\n\n`;

  if (existingTripPlan) {
    prompt += `Current trip plan:\n`;
    prompt += `Destination: ${existingTripPlan.destination}\n`;
    if (existingTripPlan.startDate) prompt += `Start Date: ${existingTripPlan.startDate}\n`;
    if (existingTripPlan.endDate) prompt += `End Date: ${existingTripPlan.endDate}\n`;
    if (existingTripPlan.budget) prompt += `Budget: ${existingTripPlan.budget}\n`;
    if (existingTripPlan.travelers) prompt += `Travelers: ${existingTripPlan.travelers}\n`;
    prompt += `\nCurrent itinerary (${existingTripPlan.days.length} days):\n`;
    
    existingTripPlan.days.forEach((day) => {
      prompt += `\nDay ${day.day}: ${day.title}\n`;
      day.activities.forEach((activity) => {
        prompt += `  ${activity.time} - ${activity.title} (${activity.category})\n`;
      });
    });
    
    prompt += `\nPlease update or extend this itinerary based on the user's request.\n`;
  }

  return prompt;
}

/**
 * Validates and transforms the AI response into a proper TripPlan
 */
function validateAndTransformTripPlan(
  data: any,
  existingTripPlan?: TripPlan | null
): TripPlan | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  // If tripPlan is nested, extract it
  const tripPlanData = data.tripPlan || data;

  // Validate required fields
  if (!tripPlanData.destination && !existingTripPlan?.destination) {
    return null;
  }

  // Transform days
  const days: TripDay[] = [];
  if (Array.isArray(tripPlanData.days)) {
    tripPlanData.days.forEach((dayData: any, index: number) => {
      if (!dayData || typeof dayData !== 'object') return;

      const activities: DayActivity[] = [];
      if (Array.isArray(dayData.activities)) {
        dayData.activities.forEach((activityData: any, activityIndex: number) => {
          if (!activityData || typeof activityData !== 'object') return;

          const activity: DayActivity = {
            id: activityData.id || `${dayData.day || index + 1}-${activityIndex + 1}`,
            time: activityData.time || '09:00',
            title: activityData.title || 'Activity',
            description: activityData.description || '',
            location: activityData.location,
            category: ['transport', 'activity', 'food', 'accommodation', 'other'].includes(
              activityData.category
            )
              ? activityData.category
              : 'other',
          };

          activities.push(activity);
        });
      }

      // Sort activities by time
      activities.sort((a, b) => {
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return timeA - timeB;
      });

      days.push({
        day: dayData.day || index + 1,
        date: dayData.date,
        title: dayData.title || `Day ${dayData.day || index + 1}`,
        activities,
      });
    });
  }

  // If no days were generated but we have a destination, create at least one day
  if (days.length === 0 && tripPlanData.destination) {
    days.push({
      day: 1,
      title: 'Day 1',
      activities: [],
    });
  }

  const tripPlan: TripPlan = {
    destination: tripPlanData.destination || existingTripPlan?.destination || '',
    startDate: tripPlanData.startDate || existingTripPlan?.startDate,
    endDate: tripPlanData.endDate || existingTripPlan?.endDate,
    title: tripPlanData.title || existingTripPlan?.title,
    budget: tripPlanData.budget || existingTripPlan?.budget,
    travelers: tripPlanData.travelers || existingTripPlan?.travelers || 1,
    days,
  };

  return tripPlan;
}

/**
 * Parses time string (HH:MM) to minutes for sorting
 */
function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

