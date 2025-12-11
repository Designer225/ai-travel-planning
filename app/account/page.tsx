'use client';

import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Container, Typography, CssBaseline, Snackbar, Alert, Link as MuiLink } from "@mui/material";
import { Navigation } from "../components/layout/Navigation";
import { ProfileSection } from "../components/account/ProfileSection";
import { AccountSettings } from "../components/account/AccountSettings";
import { TravelPreferences } from "../components/account/TravelPreferences";
import { PaymentSettings } from "../components/account/PaymentSettings";
import { MyTrips } from "../components/account/MyTrips";
import { theme } from "@/app/lib/themes";

type ToastType = {
  open: boolean;
  message: string;
  description?: string;
  severity: "success" | "error" | "info" | "warning";
};

export default function AccountPage() {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Smith",
    bio: "Travel Enthusiast",
    email: "john.smith@email.com",
    location: "San Francisco, CA",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
  });

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
        <MuiLink
          href="#account-main"
          sx={{
            position: "absolute",
            top: -40,
            left: 16,
            backgroundColor: "#fff",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            color: "primary.main",
            zIndex: 2000,
            "&:focus": { top: 16 },
          }}
        >
          Skip to main content
        </MuiLink>
        <Navigation />
        <Container id="account-main" role="main" maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ color: "neutral.950", mb: 1 }}>
              My Account
            </Typography>
            <Typography variant="body1" sx={{ color: "#4a5565" }}>
              Manage your profile, trips, and billing preferences
            </Typography>
          </Box>
          
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" }, gap: 3 }}>
            <Box>
              <ProfileSection 
                profileData={profileData}
                setProfileData={setProfileData}
                showToast={showToast}
              />
            </Box>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <AccountSettings 
                profileData={profileData}
                setProfileData={setProfileData}
                showToast={showToast}
              />
              <PaymentSettings showToast={showToast} />
              <MyTrips />
              <TravelPreferences showToast={showToast} />
            </Box>
          </Box>
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
