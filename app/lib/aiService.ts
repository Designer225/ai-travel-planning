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

// Response cache configuration
interface CacheEntry {
  data: GenerateItineraryResponse;
  timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_CACHE_SIZE = 100; // Maximum number of cached entries

/**
 * Simple hash function for cache keys
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generates a cache key from the request parameters
 */
function generateCacheKey(params: GenerateItineraryParams): string {
  const keyData = {
    userMessage: params.userMessage.toLowerCase().trim(),
    existingTripPlan: params.existingTripPlan ? JSON.stringify(params.existingTripPlan) : null,
  };
  const keyString = JSON.stringify(keyData);
  return `cache_${simpleHash(keyString)}`;
}

/**
 * Gets a cached response if available and not expired
 */
function getCachedResponse(cacheKey: string): GenerateItineraryResponse | null {
  const entry = responseCache.get(cacheKey);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    // Cache expired, remove it
    responseCache.delete(cacheKey);
    return null;
  }

  return entry.data;
}

/**
 * Stores a response in the cache
 */
function setCachedResponse(cacheKey: string, data: GenerateItineraryResponse): void {
  // If cache is too large, remove oldest entries
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const entries = Array.from(responseCache.entries());
    // Sort by timestamp and remove oldest 20%
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
    for (let i = 0; i < toRemove; i++) {
      responseCache.delete(entries[i][0]);
    }
  }

  responseCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Cleans up expired cache entries (call periodically)
 */
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
}

// Clean up cache every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupCache, 10 * 60 * 1000);
}

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

  // Check cache first
  const cacheKey = generateCacheKey(params);
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    console.log('Returning cached response');
    return cachedResponse;
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

    // Build conversation history for Gemini API (if available)
    const history = params.conversationHistory?.slice(-8) || []; // Last 8 messages
    const conversationParts = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Make the API call with timeout
    const generateContentPromise = model.generateContent({
      contents: [
        ...conversationParts,
        { role: 'user', parts: [{ text: fullPrompt }] },
      ],
      generationConfig: {
        temperature: 0.8, // Slightly higher for more conversational responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });

    const apiResult = await Promise.race([generateContentPromise, timeoutPromise]);
    const response = apiResult.response;
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

    const result: GenerateItineraryResponse = {
      success: true,
      responseText,
      tripPlan: tripPlan || undefined,
    };

    // Cache the successful response
    setCachedResponse(cacheKey, result);

    return result;
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
  return `You are a friendly, conversational travel planning assistant. You help users plan amazing trips through natural, helpful conversations.

CONVERSATION STYLE:
- Be warm, friendly, and conversational - like talking to a knowledgeable friend
- Answer questions directly and naturally before making any changes
- Understand context from the conversation history - if someone asks "How about in October?" after discussing weather, they're asking about weather in October, NOT asking to change trip dates
- Only modify the itinerary when the user EXPLICITLY asks to change, add, or modify something
- For follow-up questions (weather, costs, recommendations, etc.), just answer the question - don't change the trip unless asked

RESPONSE FORMAT:
When a user requests a trip plan or itinerary changes, return JSON with this structure:
{
  "responseText": "A natural, conversational response (2-4 sentences). Be friendly and helpful.",
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

CRITICAL RULES:
1. If the user asks a QUESTION (weather, costs, recommendations, "what about X?", "how about Y?"), answer the question conversationally. ONLY include "tripPlan" if they explicitly ask to change the itinerary.
2. If the user says "change to October" or "update the dates" - THEN modify the tripPlan
3. If the user asks "How about in October?" after discussing weather - they want weather info for October, NOT a date change
4. Activities MUST be in chronological order (sorted by time)
5. Times should be realistic and allow for travel between locations
6. Include a mix of activities: transport, accommodation, food, and activities
7. Each activity must have a unique ID (use simple strings like "1", "2", etc.)
8. If modifying an existing trip, preserve existing days unless explicitly asked to change them
9. Always return valid JSON - no markdown formatting

For general questions that don't require itinerary changes, return:
{
  "responseText": "Your helpful, conversational answer here"
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
  let prompt = '';

  // Include conversation history for context (last 5-6 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += 'CONVERSATION HISTORY (for context - understand what was just discussed):\n';
    const recentHistory = conversationHistory.slice(-6); // Last 6 messages for context
    recentHistory.forEach((msg) => {
      prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    prompt += '\n';
  }

  // Current user message
  prompt += `CURRENT USER MESSAGE: ${userMessage}\n\n`;

  // Include trip plan if it exists
  if (existingTripPlan) {
    prompt += `CURRENT TRIP PLAN:\n`;
    prompt += `Destination: ${existingTripPlan.destination}\n`;
    if (existingTripPlan.startDate) prompt += `Start Date: ${existingTripPlan.startDate}\n`;
    if (existingTripPlan.endDate) prompt += `End Date: ${existingTripPlan.endDate}\n`;
    if (existingTripPlan.budget) prompt += `Budget: ${existingTripPlan.budget}\n`;
    if (existingTripPlan.travelers) prompt += `Travelers: ${existingTripPlan.travelers}\n`;
    
    if (existingTripPlan.days.length > 0) {
      prompt += `\nCurrent itinerary (${existingTripPlan.days.length} days):\n`;
      existingTripPlan.days.forEach((day) => {
        prompt += `\nDay ${day.day}: ${day.title}\n`;
        day.activities.forEach((activity) => {
          prompt += `  ${activity.time} - ${activity.title} (${activity.category})\n`;
        });
      });
    }
    
    prompt += `\nIMPORTANT: Only modify this trip plan if the user EXPLICITLY asks to change, add, or update something. If they're just asking a question, answer it without changing the trip plan.\n`;
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

