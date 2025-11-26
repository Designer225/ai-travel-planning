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
        
        <div className="flex items-center gap-6">
          <Link href="/my-trips" className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md px-2 py-1">
            My trips
          </Link>
          <Button variant="outline" aria-label="Sign in to your account">Sign in</Button>
        </div>
      </div>
    </nav>
  );
}
