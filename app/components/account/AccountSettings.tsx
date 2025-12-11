'use client';

import { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';

interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl: string;
}

interface AccountSettingsProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  showToast: (message: string, severity: "success" | "error" | "info" | "warning", description?: string) => void;
}

export function AccountSettings({ profileData, setProfileData, showToast }: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    bio: profileData.bio,
    email: profileData.email,
    location: profileData.location,
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    travelRecommendations: true,
    priceAlerts: false,
  });

  const [originalNotifications] = useState({ ...notifications });

  // Update form data when profileData changes from other components
  useEffect(() => {
    const newFormData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.bio,
      email: profileData.email,
      location: profileData.location,
    };
    setFormData(newFormData);
    setOriginalData(newFormData);
  }, [profileData]);

  const handleSave = () => {
    // Update the shared profile data
    setProfileData({
      ...profileData,
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.bio,
      email: formData.email,
      location: formData.location,
    });
    
    // Update original data to reflect saved state
    setOriginalData({ ...formData });
    
    showToast("Settings saved successfully!", "success", "Your account settings have been updated.");
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setNotifications({ ...originalNotifications });
    showToast("Changes discarded", "info", "Your settings were not saved.");
  };

  const hasChanges = 
    JSON.stringify(formData) !== JSON.stringify(originalData) ||
    JSON.stringify(notifications) !== JSON.stringify(originalNotifications);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Account Settings
      </Typography>
      
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 2 }}>
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          fullWidth
          sx={{ 
            "& .MuiOutlinedInput-root": { 
              bgcolor: "#f3f3f5",
              "& fieldset": { border: "none" },
            },
          }}
        />
        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          fullWidth
          sx={{ 
            "& .MuiOutlinedInput-root": { 
              bgcolor: "#f3f3f5",
              "& fieldset": { border: "none" },
            },
          }}
        />
      </Box>

      <TextField
        label="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        placeholder="e.g., Travel Enthusiast"
        fullWidth
        sx={{ 
          mb: 2,
          "& .MuiOutlinedInput-root": { 
            bgcolor: "#f3f3f5",
            "& fieldset": { border: "none" },
          },
        }}
      />

      <TextField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        fullWidth
        sx={{ 
          mb: 2,
          "& .MuiOutlinedInput-root": { 
            bgcolor: "#f3f3f5",
            "& fieldset": { border: "none" },
          },
        }}
      />

      <TextField
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        fullWidth
        sx={{ 
          mb: 3,
          "& .MuiOutlinedInput-root": { 
            bgcolor: "#f3f3f5",
            "& fieldset": { border: "none" },
          },
        }}
      />

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Notifications
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }} id='email-notifications' >
              Email Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Receive updates about your trips
            </Typography>
          </Box>
          <Switch
            checked={notifications.emailNotifications}
            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
            slotProps={{
              input: {
                "aria-labelledby": "email-notifications"
              }
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }} id='travel-recommendations'>
              Travel Recommendations
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Get AI-powered destination suggestions
            </Typography>
          </Box>
          <Switch
            checked={notifications.travelRecommendations}
            onChange={(e) => setNotifications({ ...notifications, travelRecommendations: e.target.checked })}
            slotProps={{
              input: {
                "aria-labelledby": "travel-recommendations"
              }
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }} id='price-alerts'>
              Price Alerts
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Notify me of price changes
            </Typography>
          </Box>
          <Switch
            checked={notifications.priceAlerts}
            onChange={(e) => setNotifications({ ...notifications, priceAlerts: e.target.checked })}
            slotProps={{
              input: {
                "aria-labelledby": "price-alerts"
              }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          variant="contained"
          className="gradient-button"
        >
          Save Changes
        </Button>
        <Button
          onClick={handleCancel}
          disabled={!hasChanges}
          variant="outlined"
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
}
