'use client';

import dynamic from 'next/dynamic';

const MapExplore = dynamic(() => import('@/app/components/map/MapExplore').then(m => m.MapExplore), {
  ssr: false,
});

export default function MapExplorePage() {
  return <MapExplore />;
}

