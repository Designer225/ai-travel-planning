import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import Link from 'next/link';
import { MapPin, Calendar, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden" aria-label="Hero section">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1669986480140-2c90b8edb443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjI5MzUwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Mountain landscape representing travel adventure"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl mb-6">
              Craft Your Perfect Trip, Instantly.
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Plan, organize, and discover your dream destinations with ease
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" aria-label="Start planning your next adventure">
                Plan your next adventure
              </Button>
              <Link href="/my-trips">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20">
                  My trips
                </Button>
              </Link>
            </div>
          </div>
        </section>
      
        {/* Description Section */}
        <section className="py-20 px-4" aria-labelledby="features-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 id="features-heading" className="text-4xl mb-4">Everything you need to plan your journey</h2>
              <p className="text-xl text-gray-600">
                TripCraft makes travel planning effortless with powerful tools to organize every detail
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12" role="list">
              <div className="text-center" role="listitem">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl mb-3">Discover Destinations</h3>
              <p className="text-gray-600">
                Explore amazing places around the world and create detailed itineraries for each location
              </p>
            </div>
            
              <div className="text-center" role="listitem">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl mb-3">Organize Your Schedule</h3>
              <p className="text-gray-600">
                Keep track of dates, bookings, and activities all in one place for stress-free travel
              </p>
            </div>
            
              <div className="text-center" role="listitem">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl mb-3">Share with Friends</h3>
              <p className="text-gray-600">
                Collaborate on trip plans and share your adventures with travel companions
              </p>
            </div>
          </div>
        </div>
      </section>
      
        {/* CTA Section */}
        <section className="py-20 px-4 bg-blue-50" aria-labelledby="cta-heading">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 id="cta-heading" className="text-4xl mb-4">Ready to start planning?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of travelers who trust TripCraft to organize their adventures
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" aria-label="Get started with TripCraft for free">
              Get started for free
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

