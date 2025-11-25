"use client";

import { useState } from 'react';
import { TripsList } from './components/TripsList';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-gray-900">My Trips</h1>
              <p className="text-gray-600 mt-1">Manage your travel plans and itineraries</p>
            </div>
            <Button className="sm:w-auto w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create New Trip
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'past'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Past
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved
          </button>
        </div>

        {/* Trips List */}
        <div className="mt-6">
          <TripsList 
            tripType={activeTab} 
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
}
