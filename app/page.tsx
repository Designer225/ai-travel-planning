import { Navigation } from '@/components/Navigation';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import MapIcon from '@mui/icons-material/Map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
      <Navigation />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1669986480140-2c90b8edb443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjI5MzUwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Travel adventure"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          }}
        />
        
        <Container
          maxWidth="md"
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '3.75rem' }, mb: 3 }}>
            Craft Your Perfect Trip, Instantly.
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            Plan, organize, and discover your dream destinations with ease
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Plan your next adventure
            </Button>
            <Link href="/my-trips" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'white',
                  },
                }}
              >
                My trips
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
      
      {/* Description Section */}
      <Box sx={{ py: 10, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
              Everything you need to plan your journey
            </Typography>
            <Typography variant="h5" color="text.secondary">
              TripCraft makes travel planning effortless with powerful tools to organize every detail
            </Typography>
          </Box>
          
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <MapIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Typography variant="h3" sx={{ mb: 1.5 }}>
                  Discover Destinations
                </Typography>
                <Typography color="text.secondary">
                  Explore amazing places around the world and create detailed itineraries for each location
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Typography variant="h3" sx={{ mb: 1.5 }}>
                  Organize Your Schedule
                </Typography>
                <Typography color="text.secondary">
                  Keep track of dates, bookings, and activities all in one place for stress-free travel
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <GroupIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Typography variant="h3" sx={{ mb: 1.5 }}>
                  Share with Friends
                </Typography>
                <Typography color="text.secondary">
                  Collaborate on trip plans and share your adventures with travel companions
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box sx={{ py: 10, px: 2, bgcolor: 'primary.light' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Ready to start planning?
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of travelers who trust TripCraft to organize their adventures
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Get started for free
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

