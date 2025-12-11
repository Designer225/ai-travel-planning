`use client`;

import { Navigation } from '../layout/Navigation';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/app/lib/themes';

export default function Landing() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh"
        sx={{
          background: "linear-gradient(147.631deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 50%, rgb(250, 245, 255) 100%)",
        }}
      >
        <Navigation />
        
        <main>
          <HeroSection />
          <FeaturesSection />
          <CTASection />
        </main>
      </Box>
    </ThemeProvider>
  );
}
