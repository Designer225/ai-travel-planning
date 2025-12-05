import { MapPin, Calendar, Users } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { Box, Grid, Typography } from '@mui/material';

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: 'Discover Destinations',
      description: 'Explore amazing places around the world and create detailed itineraries for each location',
    },
    {
      icon: Calendar,
      title: 'Organize Your Schedule',
      description: 'Keep track of dates, bookings, and activities all in one place for stress-free travel',
    },
    {
      icon: Users,
      title: 'Share with Friends',
      description: 'Collaborate on trip plans and share your adventures with travel companions',
    },
  ];

  return (
    <Box paddingBlock={20} paddingInline={4} aria-labelledby='features-heading'>
      <Box textAlign='center' marginBottom={16}>
        <Typography variant='h2' id='features-heading' fontSize="2.25rem" lineHeight="calc(2.5/2.25)" marginBottom={4}>
          Everything you need to plan your journey
        </Typography>
        <Typography variant='body1' fontSize="1.25rem" lineHeight={1.4} className='feature-subtitle'>
          TripAI makes travel planning effortless with powerful tools to organize every detail
        </Typography>
      </Box>
      <Grid container columns={{ xs: 1, md: 3 }} gap={12} justifyContent="center">
        {features.map((feature) => (
          <Grid key={feature.title}>
            <FeatureCard 
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
