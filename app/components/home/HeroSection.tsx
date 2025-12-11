'use client'

// import { Box, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { tryEnterDashboard } from '@/app/lib/clientUserGate';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function HeroSection() {
  const router = useRouter();

  return (
    <Box position="relative" height="600px" display={'flex'} alignItems="center" justifyContent="center" overflow="hidden" aria-label='Hero section'>
      <Box position="absolute" zIndex={0} sx={{ inset: 0 }} aria-hidden={true}>
        <Image
          src="https://images.unsplash.com/photo-1669986480140-2c90b8edb443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjI5MzUwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Mountain landscape representing travel adventure"
          className="w-full h-full object-cover"
          width={1080}
          height={600}
        />
        {/* <ImageWithFallback
          src="https://images.unsplash.com/photo-1669986480140-2c90b8edb443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBtb3VudGFpbnxlbnwxfHx8fDE3NjI5MzUwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Mountain landscape representing travel adventure"
          className="w-full h-full object-cover"
        /> */}
        <Box position="absolute" bgcolor="#00000065" sx={{ inset: 0 }} />
      </Box>

      <Box position="relative" textAlign="center" paddingInline={4} color="#ffffff" zIndex={10}>
        <Typography variant='h1' marginBottom={6} marginTop={20} fontSize={{ xs: "3rem", md: "3.75rem" }} lineHeight={1}>
          Craft Your Perfect Trip, Instantly.
        </Typography>
        <Typography variant='body1' marginBottom={8} maxWidth="36rem" fontSize="1.25rem" lineHeight={1.4} marginInline="auto">
          Plan, organize, and discover your dream destinations with ease
        </Typography>
        <Button onClick={() => tryEnterDashboard(router)} variant='contained' className="gradient-button" aria-label="Start planning your next adventure">
          Plan your next adventure
        </Button>
      </Box>
    </Box>
  );
}
