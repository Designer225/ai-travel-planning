'use client'

import { tryEnterDashboard } from '@/app/lib/clientUserGate';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export function CTASection() {
  const router = useRouter();

  return (
    <Box paddingBlock={20} paddingInline={4} bgcolor="#eff6ff" aria-labelledby='cta-heading'>
      <Grid container columns={1} marginInline='auto' maxWidth='56rem' textAlign='center' justifyContent='center'>
        <Grid>
          <Typography variant='h2' id='cta-heading' marginBottom={4} fontSize='2.25rem' lineHeight='calc(2.5/2.25)'>Reading to start planning?</Typography>
        </Grid>
        <Grid size={1} marginBottom={4}>
          <Typography variant='body1' fontSize='1.125rem' lineHeight='calc(1.75/1.25)' className='feature-subtitle-darker'>
            Join thousands of travelers who trust TripAI to organize their adventures
          </Typography>
        </Grid>
        <Grid>
          {/* TODO: redirect to login page or dashboard as appropriate */}
          <Button onClick={() => tryEnterDashboard(router)} variant='contained' className="gradient-button" aria-label="Get started with TripAI for free">
            Get started for free
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
