import Link from 'next/link';
import { AppBar, Toolbar, Box, Button, Container } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export function Navigation() {
  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <FlightTakeoffIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
            <Box component="span" sx={{ fontSize: 20, fontWeight: 500 }}>
              TripCraft
            </Box>
          </Link>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Link href="/my-trips" style={{ textDecoration: 'none', color: '#374151', transition: 'color 0.2s' }}>
              My trips
            </Link>
            <Button variant="outlined">Sign in</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
