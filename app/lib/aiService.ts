import { GoogleGenerativeAI } from '@google/generative-ai';
import { TripPlan, TripDay, DayActivity } from '@/types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will not work.');
}

// Initialize Gemini
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Primary and fallback models
const MODEL_NAME = 'gemini-2.5-flash-lite';
const FALLBACK_MODEL_NAME = 'gemini-2.0-flash';

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
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code || '';
  
  // Retry on network errors, timeouts, and rate limits
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('429') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('econnreset') ||
    errorMessage.includes('etimedout') ||
    errorCode === 'ECONNRESET' ||
    errorCode === 'ETIMEDOUT'
  ) {
    return true;
  }
  
  // Don't retry on authentication errors, invalid requests, etc.
  if (
    errorMessage.includes('api_key') ||
    errorMessage.includes('401') ||
    errorMessage.includes('403') ||
    errorMessage.includes('400') ||
    errorMessage.includes('invalid')
  ) {
    return false;
  }
  
  // Default to retryable for unknown errors
  return true;
}

function isRateLimitError(error: any): boolean {
  const msg = error?.message?.toLowerCase() || '';
  return msg.includes('429') || msg.includes('rate limit');
}

/**
 * Generates a structured travel itinerary using Google Gemini AI with retry logic
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

  const MAX_RETRIES = 3;
  let lastError: any = null;

  // Retry loop
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const modelsToTry = [MODEL_NAME, FALLBACK_MODEL_NAME];
      let lastModelError: any = null;
      const triedModels: string[] = [];

      for (const modelName of modelsToTry) {
        try {
          triedModels.push(modelName);
          const model = genAI.getGenerativeModel({ model: modelName });

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
            // Second attempt: try to grab the first JSON object in the text
            try {
              const fallbackMatch = text.match(/\{[\s\S]*\}/);
              if (fallbackMatch) {
                parsedResponse = JSON.parse(fallbackMatch[0]);
              }
            } catch (secondaryParseError) {
              console.error('Failed to parse AI response as JSON:', text);
              // Fallback: return a friendly text response without structured data
              return {
                success: true,
                responseText:
                  'I updated your itinerary. Please try again if you want more details, or ask me to adjust anything specific.',
              };
            }
          }

          // Extract response text and trip plan
          let responseText = parsedResponse.responseText || parsedResponse.message || text;
          // Guard against accidental object/stringified JSON showing to users
          if (typeof responseText !== 'string' || responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
            responseText = 'I updated your itinerary. Let me know if you want further changes or more details.';
          }

          // Only process tripPlan if it exists in the response
          // For general questions, tripPlan should not be included
          let tripPlan: TripPlan | undefined = undefined;
          if (parsedResponse.tripPlan) {
            const validatedTripPlan = validateAndTransformTripPlan(parsedResponse.tripPlan, params.existingTripPlan);
            // Only include tripPlan if it's valid and has days (or is explicitly modifying the trip)
            if (validatedTripPlan && validatedTripPlan.days.length > 0) {
              tripPlan = validatedTripPlan;
            } else if (validatedTripPlan && validatedTripPlan.destination) {
              // If it has a destination but no days, it might be a partial update - preserve existing
              tripPlan = validatedTripPlan;
            }
          }
          // If no tripPlan in response, preserve existing tripPlan by not including it in result

          const result: GenerateItineraryResponse = {
            success: true,
            responseText,
            tripPlan: tripPlan,
          };

          // Cache the successful response
          setCachedResponse(cacheKey, result);

          return result;
        } catch (error: any) {
          lastModelError = error;
          // If primary model hits rate limit, try fallback
          if (modelName !== FALLBACK_MODEL_NAME && isRateLimitError(error)) {
            console.warn(`Primary model ${modelName} rate limited. Trying fallback model ${FALLBACK_MODEL_NAME}...`);
            continue; // try next model
          }
          // Otherwise, throw to outer catch
          throw error;
        }
      }

      // If we get here, all models failed
      // Attach info about models tried
      if (lastModelError) {
        lastModelError.triedModels = triedModels;
      }
      throw lastModelError;
    } catch (error: any) {
      lastError = error;
      console.error(`Error generating itinerary (attempt ${attempt + 1}/${MAX_RETRIES}):`, error);

      // Check if error is retryable
      if (!isRetryableError(error)) {
        // Non-retryable error, return immediately
        break;
      }

      // If this is the last attempt, don't retry
      if (attempt === MAX_RETRIES - 1) {
        break;
      }

      // Calculate exponential backoff delay: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  // All retries failed, return appropriate error
  const error = lastError;
  
  // Handle specific error types with user-friendly messages
  if (error?.message?.includes('timeout') || error?.message?.includes('30 seconds')) {
    return {
      success: false,
      responseText: 'The request took too long to complete. This might be due to a slow connection. Please try again with a simpler request, or check your internet connection.',
      error: 'TIMEOUT',
    };
  }

  if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('403')) {
    return {
      success: false,
      responseText: 'Invalid or missing API key. Please check your GEMINI_API_KEY configuration in your environment variables.',
      error: 'INVALID_API_KEY',
    };
  }

  if (error?.message?.includes('429') || error?.message?.includes('rate limit')) {
    const tried = Array.isArray(error?.triedModels) ? error.triedModels.join(', ') : 'the available models';
    return {
      success: false,
      responseText: `Rate limit exceeded. We tried ${tried}. Please wait 30-60 seconds and try again, or reduce request frequency.`,
      error: 'RATE_LIMIT',
    };
  }

  if (error?.message?.includes('network') || error?.message?.includes('ECONNRESET') || error?.message?.includes('ETIMEDOUT')) {
    return {
      success: false,
      responseText: 'Network connection error. Please check your internet connection and try again. If the problem persists, the service might be temporarily unavailable.',
      error: 'NETWORK_ERROR',
    };
  }

  // Generic error fallback
  return {
    success: false,
    responseText: 'I encountered an unexpected error. Please try again in a moment. If the problem continues, try rephrasing your request.',
    error: error?.message || 'UNKNOWN_ERROR',
  };
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

COST ESTIMATION:
- When generating itineraries, include estimated costs in the activity description when relevant
- Format costs as: "Estimated cost: $X" or "Cost: $X-Y" in the description
- For accommodation, include per-night cost
- For food, include per-person cost
- For activities, include per-person or total cost
- This helps users understand the budget needed

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
10. Include cost estimates in activity descriptions when generating new itineraries

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

  // Include conversation history for context (last 10 messages)
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += 'CONVERSATION HISTORY (for context - understand what was just discussed):\n';
    const recentHistory = conversationHistory.slice(-10); // Last 10 messages for context
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

  // Date normalization: ensure future defaults
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultStart = new Date(today);
  defaultStart.setDate(defaultStart.getDate() + 14); // two weeks from today

  const parseDate = (value?: string | null) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatISODate = (d: Date | null) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      : undefined;

  // Prefer AI-provided date, else existing trip date
  let startDateParsed = parseDate(tripPlanData.startDate) || parseDate(existingTripPlan?.startDate);
  if (!startDateParsed || startDateParsed < today) {
    startDateParsed = defaultStart;
  }

  let endDateParsed = parseDate(tripPlanData.endDate) || parseDate(existingTripPlan?.endDate);
  if ((!endDateParsed || (startDateParsed && endDateParsed < startDateParsed)) && days.length > 0) {
    endDateParsed = new Date(startDateParsed);
    endDateParsed.setDate(startDateParsed.getDate() + (days.length - 1));
  }

  const tripPlan: TripPlan = {
    destination: tripPlanData.destination || existingTripPlan?.destination || '',
    startDate: formatISODate(startDateParsed),
    endDate: formatISODate(endDateParsed),
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

