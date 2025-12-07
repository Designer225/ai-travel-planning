'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChatPanel } from './ChatPanel';
import { MapPin, Sparkles } from 'lucide-react';
import { TripPlan } from '@/types';
import { Navigation } from '../layout/Navigation';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@/app/lib/themes';

// Dynamically import TripPanel to reduce initial bundle size
// Only load when needed (when tripPlan exists or on larger screens)
const TripPanel = dynamic(() => import('./TripPanel').then(mod => ({ default: mod.TripPanel })), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-gray-500">Loading itinerary panel...</div>
    </div>
  ),
});

export default function AIChatbot() {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <ThemeProvider theme={theme}>
        <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
          <CssBaseline />
          <Navigation />
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MapPin className="w-8 h-8 text-blue-600" />
                  <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
                </div>
                <div>
                  <h1 className="text-xl">TripAI</h1>
                  <p className="text-sm text-gray-600">Your AI Travel Planning Assistant</p>
                </div>
              </div>
              
              {tripPlan && (
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{tripPlan.destination}</span>
                  </div>
                  {tripPlan.days.length > 0 && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {tripPlan.days.length} {tripPlan.days.length === 1 ? 'day' : 'days'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel - Left Side */}
          <div className="w-full md:w-1/2 lg:w-2/5 border-r bg-white flex flex-col">
            <ChatPanel tripPlan={tripPlan} setTripPlan={setTripPlan} />
          </div>

          {/* Trip Planning Panel - Right Side */}
          <div className="hidden md:flex md:w-1/2 lg:w-3/5 flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
            <TripPanel 
              tripPlan={tripPlan} 
              setTripPlan={setTripPlan}
              onSendMessage={(message) => {
                // Trigger message in ChatPanel via a custom event or ref
                // For now, we'll use a custom event
                window.dispatchEvent(new CustomEvent('chat-send-message', { detail: { message } }));
              }}
            />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}



