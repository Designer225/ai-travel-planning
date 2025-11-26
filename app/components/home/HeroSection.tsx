import { Button } from '../ui/button';
import { ImageWithFallback } from '../ui/image-with-fallback';
import Link from 'next/link';

export function HeroSection() {
  return (
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
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white">
              My trips
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
