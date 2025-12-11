'use client';

import { startTransition, useState, useEffect } from 'react';
import { Navigation } from '../layout/Navigation';
import { TripsHeader } from './TripsHeader';
import { TripsList } from './TripsList';
import { TripsListHeader } from './TripsListHeader';
import { ScrollArea } from '../ui/scroll-area';
import { tryEnterItineraryBuilder, tryGetCurrentUser } from '@/app/lib/clientUserGate';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/app/lib/themes';

export default function Trips() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTransition(async () => {
      const user = await tryGetCurrentUser(router);
      if (!user) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleCreateTrip = () => {
    startTransition(async () => {
      await tryEnterItineraryBuilder(router);
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header>
          <Navigation/>
        </header>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <header>
          <Navigation/>
        </header>
        
        <main id="main-content" className="flex flex-col flex-1 overflow-hidden container mx-auto px-4 py-8">
          <TripsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateTrip={handleCreateTrip}
          />
          
          {/* Tabs */}
          <TripsListHeader
            activeTab={activeTab}
            onSetActiveTab={setActiveTab}
          />
          
          <ScrollArea className='h-full overflow-auto'>
            {/* Trips List */}
            <div className="mt-6">
              <TripsList 
                tripType={activeTab} 
                searchQuery={searchQuery}
              />
            </div>
          </ScrollArea>
        </main>
      </ThemeProvider>
    </div>
  );
}
