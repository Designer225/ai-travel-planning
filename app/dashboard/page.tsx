'use client';

import { ThemeProvider } from "@mui/material/styles";
import { Box, Container, Typography, CssBaseline, Grid, Paper, Button } from "@mui/material";
import Link from "next/link";
import { Navigation } from "@/app/components/layout/Navigation";
import { theme } from "@/app/lib/themes";
import { BotMessageSquare, Sparkles, Map, User, ShoppingCart, Car } from "lucide-react";

const routes = [
  {
    title: "AI Chatbot",
    description: "Chat with AI to plan your perfect trip and get personalized recommendations.",
    href: "/chat",
    icons: <BotMessageSquare className="w-8 h-8 text-green-600" />
  },
  {
    title: "Itinerary Builder",
    description: "Create and edit your travel itinerary with drag-and-drop activities.",
    href: "/itinerary-builder",
    icons: <Sparkles className="w-8 h-8 text-blue-600" />
  },
  {
    title: "Map Explorer",
    description: "Explore destinations, attractions, restaurants, and lodging on an interactive map.",
    href: "/map-explore",
    icons: <Map className="w-8 h-8 text-purple-600" />
  },
  {
    title: "Account",
    description: "Manage your profile, preferences, and payment methods.",
    href: "/account",
    icons: <User className="w-8 h-8 text-red-600" />
  },
  {
    title: "My Trips",
    description: "Managed upcoming trips, look at past trips, and review saved trips.",
    href: "/my-trips",
    icons: <Car className="w-8 h-8 text-orange-600" />
  },
  {
    title: "Checkout",
    description: "Confirm booking details and complete payment.",
    href: "/checkout",
    icons: <ShoppingCart className="w-8 h-8 text-yellow-600" />
  },
];

export default function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh"
        sx={{
          background: "linear-gradient(147.631deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 50%, rgb(250, 245, 255) 100%)",
        }}
      >
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" sx={{ color: "neutral.950", mb: 2 }}>
              Welcome to TripAI
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a5565", maxWidth: 640, mx: "auto" }}>
              Plan, book, and manage every part of your travel journey. Choose a page below to get started.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {routes.map((route) => (
              <Grid size={{ xs: 12, md: 6 }} key={route.href}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid rgba(65, 53, 53, 0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    textAlign: 'center'
                  }}
                >
                  { route.icons && <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    {route.icons}
                  </Box> }
                  <Box>
                    <Typography variant="h6">{route.title}</Typography>
                    <Typography variant="body2" sx={{ color: "#4a5565", mt: 1 }}>
                      {route.description}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: "auto" }}>
                    <Button
                      component={Link}
                      href={route.href}
                      variant="contained"
                      fullWidth
                      className="gradient-button"
                    >
                      Go to {route.title}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}