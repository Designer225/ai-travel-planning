import { Navigation } from './components/layout/Navigation';
import { HeroSection } from './components/home/HeroSection';
import { FeaturesSection } from './components/home/FeaturesSection';
import { CTASection } from './components/home/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}

