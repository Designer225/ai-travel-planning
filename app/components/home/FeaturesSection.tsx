import { MapPin, Calendar, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Discover Destinations',
      description: 'Explore amazing places around the world and create detailed itineraries for each location',
    },
    {
      icon: Calendar,
      title: 'Organize Your Schedule',
      description: 'Keep track of dates, bookings, and activities all in one place for stress-free travel',
    },
    {
      icon: Users,
      title: 'Share with Friends',
      description: 'Collaborate on trip plans and share your adventures with travel companions',
    },
  ];

  return (
    <section className="py-20 px-4" aria-labelledby="features-heading">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-4xl mb-4">
            Everything you need to plan your journey
          </h2>
          <p className="text-xl text-gray-600">
            TripCraft makes travel planning effortless with powerful tools to organize every detail
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12" role="list">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
