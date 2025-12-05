'use client';

import { useState, useRef } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import { CameraAlt, Email, LocationOn, Upload } from "@mui/icons-material";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const result = await updateUserProfile({
      firstName: editData.firstName,
      lastName: editData.lastName,
      bio: editData.bio,
      location: editData.location,
    });

    if (result.success && result.user) {
      setProfileData(result.user);
      setIsDialogOpen(false);
      showToast("Profile updated successfully!", "success", "Your changes have been saved.");
    } else {
      showToast("Update failed", "error", result.error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsDialogOpen(false);
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

  const handleDialogFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setEditData({ ...editData, avatarUrl: newAvatarUrl });
        showToast("Photo selected!", "success", "Click 'Save Changes' to update your profile.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = () => {
    setEditData({ ...profileData });
    setIsDialogOpen(true);
  };

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 4,
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={profileData.avatarUrl}
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

          <Typography variant="h6" sx={{ textAlign: "center", mb: 0.5 }}>
            {profileData.firstName} {profileData.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            {profileData.bio}
          </Typography>

          <Box sx={{ width: "100%", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, color: "#4a5565" }}>
              <Email sx={{ fontSize: 16 }} />
              <Typography variant="body2">{profileData.email}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#4a5565" }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography variant="body2">{profileData.location}</Typography>
            </Box>
          </Box>

          <Button
            onClick={handleOpenDialog}
            fullWidth
            variant="contained"
            className="gradient-button"
            sx={{
              borderRadius: 2,
            }}
          >
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Member since
          </Typography>
          <Typography variant="body1">January 2024</Typography>
        </Box>
      </Paper>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Make changes to your profile here. Click save when you're done.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Avatar
              src={editData.avatarUrl}
              className="gradient-background"
              sx={{
                width: 100,
                height: 100,
                mb: 2,
              }}
            >
              {editData.firstName[0]}{editData.lastName[0]}
            </Avatar>
            <Button
              variant="outlined"
              startIcon={<Upload />}
              onClick={() => dialogFileInputRef.current?.click()}
            >
              Change Photo
            </Button>
            <input
              ref={dialogFileInputRef}
              type="file"
              accept="image/*"
              onChange={handleDialogFileChange}
              style={{ display: "none" }}
            />
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
            label="Email"
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
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#f3f3f5",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancel}
            variant="outlined"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            fullWidth
            className="gradient-button"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
