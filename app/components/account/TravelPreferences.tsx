'use client';

import { useState } from "react";
import { Paper, Chip, Button, Box, Typography, Divider } from "@mui/material";
import { 
  Check, 
  CalendarMonth, 
  LocationOn, 
  Restaurant, 
  Hotel,
  Visibility,
  Schedule,
} from "@mui/icons-material";

const SEASONS = ["Spring", "Summer", "Fall", "Winter"];
const INTERESTS = [
  "Adventure", "Culture", "Beach", "Food & Wine", "Photography", 
  "Nature", "Hiking", "Shopping", "Nightlife", "Museums", 
  "Architecture", "Wildlife"
];
const DINING = [
  "Local Cuisine", "Fine Dining", "Street Food", "Vegetarian", 
  "Vegan", "Seafood", "Casual Dining", "Michelin Star"
];
const ACCOMMODATION = [
  "Hotels", "Boutique", "Airbnb", "Hostels", 
  "Resorts", "Luxury", "Budget-Friendly", "Bed & Breakfast"
];
const BUDGET = ["Budget", "Mid-Range", "Luxury", "Ultra-Luxury"];
const PACE = ["Relaxed", "Moderate", "Fast-Paced", "Flexible"];

interface TravelPreferencesProps {
  showToast: (message: string, severity: "success" | "error" | "info" | "warning", description?: string) => void;
}

export function TravelPreferences({ showToast }: TravelPreferencesProps) {
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(["Spring", "Fall"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Adventure", "Culture", "Beach"]);
  const [selectedDining, setSelectedDining] = useState<string[]>(["Local Cuisine", "Fine Dining"]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>(["Hotels"]);
  const [selectedBudget, setSelectedBudget] = useState<string[]>(["Mid-Range"]);
  const [selectedPace, setSelectedPace] = useState<string[]>(["Moderate"]);

  const [originalPreferences] = useState({
    seasons: [...selectedSeasons],
    interests: [...selectedInterests],
    dining: [...selectedDining],
    accommodation: [...selectedAccommodation],
    budget: [...selectedBudget],
    pace: [...selectedPace],
  });

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(s => s !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const hasChanges = () => {
    return (
      JSON.stringify(selectedSeasons.sort()) !== JSON.stringify(originalPreferences.seasons.sort()) ||
      JSON.stringify(selectedInterests.sort()) !== JSON.stringify(originalPreferences.interests.sort()) ||
      JSON.stringify(selectedDining.sort()) !== JSON.stringify(originalPreferences.dining.sort()) ||
      JSON.stringify(selectedAccommodation.sort()) !== JSON.stringify(originalPreferences.accommodation.sort()) ||
      JSON.stringify(selectedBudget.sort()) !== JSON.stringify(originalPreferences.budget.sort()) ||
      JSON.stringify(selectedPace.sort()) !== JSON.stringify(originalPreferences.pace.sort())
    );
  };

  const handleSave = () => {
    showToast("Preferences saved successfully!", "success", "Your travel preferences have been updated.");
  };

  const handleReset = () => {
    setSelectedSeasons([...originalPreferences.seasons]);
    setSelectedInterests([...originalPreferences.interests]);
    setSelectedDining([...originalPreferences.dining]);
    setSelectedAccommodation([...originalPreferences.accommodation]);
    setSelectedBudget([...originalPreferences.budget]);
    setSelectedPace([...originalPreferences.pace]);
    showToast("Changes discarded", "info", "Your preferences were not saved.");
  };

  const renderChip = (item: string, isSelected: boolean, onClick: () => void) => {
    if (isSelected) {
      return (
        <Chip
          key={item}
          label={item}
          icon={<Check sx={{ fontSize: 16, color: "white !important" }} />}
          onClick={onClick}
          sx={{
            background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
            color: "white",
            border: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
              opacity: 0.9,
            },
            "& .MuiChip-icon": {
              color: "white",
            },
          }}
        />
      );
    }
    
    return (
      <Chip
        key={item}
        label={item}
        onClick={onClick}
        variant="outlined"
        sx={{
          borderColor: "rgba(0,0,0,0.15)",
          bgcolor: "white",
          "&:hover": {
            bgcolor: "grey.50",
            borderColor: "rgba(0,0,0,0.25)",
          },
        }}
      />
    );
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
      <Typography variant="h6" sx={{ mb: 3 }}>
        Travel Preferences
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <CalendarMonth sx={{ fontSize: 20, color: "#155DFC" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Preferred Travel Season
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {SEASONS.map((season) => {
              const isSelected = selectedSeasons.includes(season);
              return renderChip(season, isSelected, () => toggleSelection(season, selectedSeasons, setSelectedSeasons));
            })}
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <LocationOn sx={{ fontSize: 20, color: "#9810FA" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Travel Interests
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return renderChip(interest, isSelected, () => toggleSelection(interest, selectedInterests, setSelectedInterests));
            })}
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Restaurant sx={{ fontSize: 20, color: "#F54900" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Dining Preferences
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {DINING.map((dining) => {
              const isSelected = selectedDining.includes(dining);
              return renderChip(dining, isSelected, () => toggleSelection(dining, selectedDining, setSelectedDining));
            })}
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Hotel sx={{ fontSize: 20, color: "#00A63E" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Accommodation Style
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {ACCOMMODATION.map((accommodation) => {
              const isSelected = selectedAccommodation.includes(accommodation);
              return renderChip(accommodation, isSelected, () => toggleSelection(accommodation, selectedAccommodation, setSelectedAccommodation));
            })}
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Visibility sx={{ fontSize: 20, color: "#155DFC" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Budget Range
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {BUDGET.map((budget) => {
              const isSelected = selectedBudget.includes(budget);
              return renderChip(budget, isSelected, () => toggleSelection(budget, selectedBudget, setSelectedBudget));
            })}
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Schedule sx={{ fontSize: 20, color: "#9810FA" }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Travel Pace
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {PACE.map((pace) => {
              const isSelected = selectedPace.includes(pace);
              return renderChip(pace, isSelected, () => toggleSelection(pace, selectedPace, setSelectedPace));
            })}
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleSave}
            disabled={!hasChanges()}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
                opacity: 0.9,
              },
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            Save Preferences
          </Button>
          <Button
            onClick={handleReset}
            disabled={!hasChanges()}
            variant="outlined"
          >
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
