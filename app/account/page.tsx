'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import { Box, Container, Typography, CssBaseline, Snackbar, Alert, CircularProgress } from "@mui/material";
import { Navigation } from "../components/layout/Navigation";
import { ProfileSection } from "../components/account/ProfileSection";
import { AccountSettings } from "../components/account/AccountSettings";
import { TravelPreferences } from "../components/account/TravelPreferences";
import { PaymentSettings } from "../components/account/PaymentSettings";
import { MyTrips } from "../components/account/MyTrips";
import { theme } from "@/app/lib/themes";
import { getCurrentUser } from "../lib/sessionControl";

type ToastType = {
  open: boolean;
  message: string;
  description?: string;
  severity: "success" | "error" | "info" | "warning";
};

export default function AccountPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    location: "",
    avatarUrl: ""
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        setProfileData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          bio: user.bio || "",
          email: user.email || "",
          location: user.location || "",
          avatarUrl: user.avatarUrl || ""
        });
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [router]);

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

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(147.631deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 50%, rgb(250, 245, 255) 100%)",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

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
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: "neutral.950", mb: 1 }}>
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
