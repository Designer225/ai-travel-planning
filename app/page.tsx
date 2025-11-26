'use client';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Container, Typography, CssBaseline, Grid, Paper, Button } from "@mui/material";
import Link from "next/link";
import { Navigation } from "./components/layout/Navigation";

const theme = createTheme({
  palette: {
    primary: {
      main: "#155dfc",
    },
    secondary: {
      main: "#9810fa",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

const routes = [
  {
    title: "Account",
    description: "Manage your profile, preferences, and payment methods.",
    href: "/account",
  },
  {
    title: "Checkout",
    description: "Confirm booking details and complete payment.",
    href: "/checkout",
  },
];

export default function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: "100vh",
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
                    border: "1px solid rgba(0,0,0,0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
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
// `use client`;

// import Landing from "./components/landing/Landing";

// export default function Home() {
//   return <Landing />;
// }
