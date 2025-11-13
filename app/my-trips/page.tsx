'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { TripCard } from '@/components/TripCard';
import { Box, Container, Typography, Button, TextField, InputAdornment, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const mockTrips = [
  {
    id: '1',
    title: 'Paris Adventure',
    location: 'Paris, France',
    date: 'Dec 15-22, 2025',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2Mjk2NTA2NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    title: 'Tokyo Experience',
    location: 'Tokyo, Japan',
    date: 'Jan 10-20, 2026',
    image: 'https://images.unsplash.com/photo-1640871426525-a19540c45a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eXxlbnwxfHx8fDE3NjI4OTY4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    title: 'Bali Retreat',
    location: 'Bali, Indonesia',
    date: 'Feb 5-15, 2026',
    image: 'https://images.unsplash.com/photo-1729605411113-daa81a7836b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjB0cm9waWNhbHxlbnwxfHx8fDE3NjI5OTQyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    title: 'New York City Break',
    location: 'New York, USA',
    date: 'Mar 1-7, 2026',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyOTg4MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export default function MyTrips() {
  const [trips, setTrips] = useState(mockTrips);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit trip:', id);
    // Handle edit functionality
  };

  const handleDelete = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const handleCreateTrip = () => {
    console.log('Create new trip');
    // Handle create trip functionality
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
      <Navigation />
      
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" sx={{ mb: 4 }}>
            My Trips
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTrip}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Create new trip
            </Button>
            
            <TextField
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: { sm: 1 }, maxWidth: { sm: 400 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
        
        {filteredTrips.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" color="text.secondary">
              No trips found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredTrips.map(trip => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={trip.id}>
                <TripCard
                  id={trip.id}
                  image={trip.image}
                  title={trip.title}
                  location={trip.location}
                  date={trip.date}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
