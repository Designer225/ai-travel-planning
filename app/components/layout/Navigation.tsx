import Link from 'next/link';
import { Plane } from 'lucide-react';
import { Button } from '../ui/button';

export function Navigation() {
  return (
    <nav className="border-b bg-white" aria-label="Main navigation">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md" aria-label="TripCraft home">
          <Plane className="w-8 h-8 text-blue-600" aria-hidden="true" />
          <span className="text-xl">TripCraft</span>
        </Link>
        
        <div className="flex items-center gap-1">
          <Link
          href="/my-trips"
          className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md px-2 py-1">
            <Button variant="outline" aria-label="Check your trips">
              My trips
            </Button>
          </Link>
          {/* TODO: redirect to login page */}
          <Link href="/dashboard">
            <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
            aria-label="Sign in to your account">
              Sign in
            </Button>
          </Link>
          {/* TODO: add alternative buttons that will access the dashboard (or open a hamburger menu doing so) */}
        </div>
      </div>
    </nav>
  );
}
