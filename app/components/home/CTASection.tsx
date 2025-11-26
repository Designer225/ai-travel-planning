import Link from 'next/link';
import { Button } from '../ui/button';

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-blue-50" aria-labelledby="cta-heading">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 id="cta-heading" className="text-4xl mb-4">Ready to start planning?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of travelers who trust TripCraft to organize their adventures
        </p>
        {/* TODO: redirect to login page or dashboard as appropriate */}
        <Link href="/dashboard">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" aria-label="Get started with TripCraft for free">
            Get started for free
          </Button>
        </Link>
      </div>
    </section>
  );
}
