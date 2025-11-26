`use client`;

import { Navigation } from '../layout/Navigation';
import { HeroSection } from '../home/HeroSection';
import { FeaturesSection } from '../home/FeaturesSection';
import { CTASection } from '../home/CTASection';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export default function Landing() {
  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header><Navigation /></header>
      
      <main id="main-content" className="flex-1 overflow-hidden">
        <ScrollArea className='h-full overflow-auto'>
            <HeroSection />
            <FeaturesSection />
            <CTASection />
        </ScrollArea>
      </main>
    </div>
  );
}
