import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary, GenerateItineraryParams } from '@/app/lib/aiService';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30 seconds timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userMessage, existingTripPlan, conversationHistory } = body;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { success: false, error: 'userMessage is required and must be a string' },
        { status: 400 }
      );
    }

    const params: GenerateItineraryParams = {
      userMessage,
      existingTripPlan: existingTripPlan || null,
      conversationHistory: conversationHistory || [],
    };

    const result = await generateItinerary(params);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          responseText: result.responseText,
          error: result.error,
        },
        { status: result.error === 'INVALID_API_KEY' ? 401 : result.error === 'RATE_LIMIT' ? 429 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      responseText: result.responseText,
      tripPlan: result.tripPlan,
    });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      {
        success: false,
        responseText: 'An unexpected error occurred. Please try again.',
        error: error.message || 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}

