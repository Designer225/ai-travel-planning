'use client';

import { useState, useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { CameraAlt } from "@mui/icons-material";
import { updateUserProfile, updateUserAvatar } from "@/app/lib/userActions";

interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  email: string;
  location: string;
  avatarUrl: string;
}

interface ProfileSectionProps {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  showToast: (message: string, severity: "success" | "error" | "info" | "warning", description?: string) => void;
}

export function ProfileSection({ profileData, setProfileData, showToast }: ProfileSectionProps) {
  const [editData, setEditData] = useState({ ...profileData });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    travelRecommendations: true,
    priceAlerts: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update editData when profileData changes (e.g., after page refresh)
  useEffect(() => {
    setEditData({ ...profileData });
  }, [profileData]);

  const handleSave = async () => {
    const result = await updateUserProfile({
      firstName: editData.firstName,
      lastName: editData.lastName,
      bio: editData.bio,
      location: editData.location,
    });

    if (result.success && result.user) {
      setProfileData(result.user);
      showToast("Profile updated successfully!", "success", "Your changes have been saved.");
    } else {
      showToast("Update failed", "error", result.error || "Failed to update profile");
    }
  };

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File too large", "error", "Please select an image smaller than 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        showToast("Invalid file type", "error", "Please select an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const newAvatarUrl = reader.result as string;
        const result = await updateUserAvatar(newAvatarUrl);
        if (result.success && result.user) {
          setProfileData(result.user);
          showToast("Avatar updated!", "success", "Your profile picture has been changed.");
        } else {
          showToast("Update failed", "error", result.error || "Failed to update avatar");
        }
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
        Profile
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
        <Box sx={{ position: "relative", mb: 2 }}>
          <Avatar
            src={profileData.avatarUrl}
            alt={`${profileData.firstName} ${profileData.lastName} avatar`}
            className="gradient-background"
            sx={{
              width: 120,
              height: 120,
            }}
          >
            {profileData.firstName[0]}{profileData.lastName[0]}
          </Avatar>
          <IconButton
            onClick={handleAvatarChange}
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              border: "1px solid rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "grey.50" },
              width: 32,
              height: 32,
            }}
            aria-label="Change profile photo"
          >
            <CameraAlt sx={{ fontSize: 16 }} />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
        <TextField
          label="First Name"
          value={editData.firstName}
          onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
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
          value={editData.lastName}
          onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
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
        value={editData.bio}
        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
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
        value={editData.email}
        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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
        value={editData.location}
        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
        fullWidth
        sx={{ 
          mb: 2,
          "& .MuiOutlinedInput-root": { 
            bgcolor: "#f3f3f5",
            "& fieldset": { border: "none" },
          },
        }}
      />

      <Button
        onClick={handleSave}
        fullWidth
        variant="contained"
        className="gradient-button"
        sx={{
          borderRadius: 2,
          mb: 3,
        }}
      >
        Save Changes
      </Button>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Notifications
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }} id='email-notifications'>
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

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Member since
        </Typography>
        <Typography variant="body1">January 2024</Typography>
      </Box>
    </Paper>
  );
}
