'use client';

import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Container, Typography, CssBaseline, Snackbar, Alert, Grid } from "@mui/material";
import { Navigation } from "../components/layout/Navigation";
import { TripSummary } from "../components/checkout/TripSummary";
import { PaymentDetails } from "../components/checkout/PaymentDetails";

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

type ToastType = {
  open: boolean;
  message: string;
  description?: string;
  severity: "success" | "error" | "info" | "warning";
};

export default function CheckoutPage() {
  const [toast, setToast] = useState<ToastType>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message: string, severity: "success" | "error" | "info" | "warning", description?: string) => {
    setToast({ open: true, message, description, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

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
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: "neutral.950", mb: 1 }}>
              Checkout
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a5565" }}>
              Confirm your booking details and payment method
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TripSummary />
            </Grid>
            <Grid item xs={12} md={8}>
              <PaymentDetails showToast={showToast} />
            </Grid>
          </Grid>
        </Container>

        <Snackbar 
          open={toast.open} 
          autoHideDuration={4000} 
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={handleCloseToast} 
            severity={toast.severity} 
            sx={{ width: "100%" }}
            variant="filled"
          >
            <Typography variant="body2">{toast.message}</Typography>
            {toast.description && (
              <Typography variant="caption" display="block">
                {toast.description}
              </Typography>
            )}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
