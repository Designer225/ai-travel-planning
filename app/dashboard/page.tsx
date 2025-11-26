import Link from "next/link";
import { MapPin, Sparkles, Map } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="flex min-h-screen w-full flex-col items-center justify-center py-16 px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logo */}
          <div className="relative">
            <MapPin className="w-16 h-16 text-blue-600" />
            <Sparkles className="w-6 h-6 text-purple-500 absolute -top-1 -right-1" />
          </div>
          
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              AI Travel Planning
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Plan your perfect trip with AI-powered itinerary building and interactive map exploration
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
            <Link
              href="/chat"
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-green-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-green-100 p-4 group-hover:bg-green-200 transition-colors">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">AI Chatbot</h2>
                <p className="text-sm text-gray-600 text-center">
                  Chat with AI to plan your perfect trip and get personalized recommendations
                </p>
              </div>
            </Link>

            <Link
              href="/itinerary-builder"
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-blue-100 p-4 group-hover:bg-blue-200 transition-colors">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Itinerary Builder</h2>
                <p className="text-sm text-gray-600 text-center">
                  Create and edit your travel itinerary with drag-and-drop activities
                </p>
              </div>
            </Link>

            <Link
              href="/map-explore"
              className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-purple-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-purple-100 p-4 group-hover:bg-purple-200 transition-colors">
                  <Map className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Map Explore</h2>
                <p className="text-sm text-gray-600 text-center">
                  Explore destinations, attractions, restaurants, and lodging on an interactive map
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
