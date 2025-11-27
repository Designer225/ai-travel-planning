'use client';

import { startTransition, useState } from "react";
import {
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { CalendarToday, AccessTime, Delete, Bookmark, LocationOn } from "@mui/icons-material";
import { Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { tryEnterMapExplorer, tryEnterMyTrips } from "@/app/lib/clientUserGate";

interface Trip {
  id: number;
  destination: string;
  dates: string;
  duration: string;
  activities: number;
  image: string;
}

const UPCOMING_TRIPS: Trip[] = [
  {
    id: 1,
    destination: "Bali, Indonesia",
    dates: "Jun 20-30, 2025",
    duration: "10 days",
    activities: 18,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    destination: "Santorini, Greece",
    dates: "Sep 8-15, 2025",
    duration: "7 days",
    activities: 14,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    destination: "Iceland",
    dates: "Oct 1-10, 2025",
    duration: "9 days",
    activities: 16,
    image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=400&h=200&fit=crop"
  }
];

const PAST_TRIPS: Trip[] = [
  {
    id: 4,
    destination: "Tokyo, Japan",
    dates: "Mar 15-22, 2024",
    duration: "7 days",
    activities: 12,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    destination: "Paris, France",
    dates: "Jan 10-17, 2024",
    duration: "7 days",
    activities: 15,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    destination: "Barcelona, Spain",
    dates: "Dec 5-12, 2023",
    duration: "7 days",
    activities: 10,
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=200&fit=crop"
  }
];

const SAVED_TRIPS: Trip[] = [
  {
    id: 7,
    destination: "Bali, Indonesia",
    dates: "Jun 20-30, 2025",
    duration: "10 days",
    activities: 18,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop"
  },
  {
    id: 8,
    destination: "Santorini, Greece",
    dates: "Sep 8-15, 2025",
    duration: "7 days",
    activities: 14,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=200&fit=crop"
  },
  {
    id: 9,
    destination: "Iceland",
    dates: "Oct 1-10, 2025",
    duration: "9 days",
    activities: 16,
    image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=400&h=200&fit=crop"
  }
];

function TripCard({ trip, isPast }: { trip: Trip; isPast: boolean }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 2,
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          sx={{
            width: 120,
            height: 80,
            borderRadius: 2,
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={trip.image}
            alt={trip.destination}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
              {trip.destination}
            </Typography>
            {!isPast && (
              <IconButton size="small">
                <Delete fontSize="small" sx={{ color: "#4a5565" }} />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4a5565" }}>
              <CalendarToday sx={{ fontSize: 12 }} />
              <Typography variant="caption">{trip.dates}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4a5565" }}>
              <AccessTime sx={{ fontSize: 12 }} />
              <Typography variant="caption">{trip.duration}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4a5565" }}>
              <LocationOn sx={{ fontSize: 12, color: "#9810FA" }} />
              <Typography variant="caption">{trip.activities} activities</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export function MyTrips() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const router = useRouter();

  const handleMoreTrips = () => {
    startTransition(async () => {
      await tryEnterMyTrips(router);
    })
  }

  const handleMoreDestinations = () => {
    startTransition(async () => {
      await tryEnterMapExplorer(router);
    })
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Trips
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{ 
          mb: 2,
          "& .MuiTabs-indicator": {
            background: "linear-gradient(135deg, #155dfc 0%, #9810fa 100%)",
          },
        }}
      >
        <Tab label="Upcoming Trips" sx={{ flex: 1 }} />
        <Tab label="Past Trips" sx={{ flex: 1 }} />
        <Tab label="Saved Trips" sx={{ flex: 1 }} />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {UPCOMING_TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={false} />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {PAST_TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={true} />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {SAVED_TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={false} />
          ))}
        </Box>
      </TabPanel>
      
      <Box sx={{ pt: 2, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
        <Button
          variant="outlined"
          startIcon={<Plane />}
          sx={{
            width: '50%',
            color: "#4a5565",
            borderColor: "rgba(0,0,0,0.1)",
            "&:hover": {
              background: "linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)",
              borderColor: "rgba(0,0,0,0.1)",
            },
          }}
          onClick={handleMoreTrips}
        >
          More Trips
        </Button>
        <Button
          variant="outlined"
          startIcon={<Bookmark />}
          sx={{
            width: '50%',
            color: "#4a5565",
            borderColor: "rgba(0,0,0,0.1)",
            "&:hover": {
              background: "linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)",
              borderColor: "rgba(0,0,0,0.1)",
            },
          }}
          onClick={handleMoreDestinations}
        >
          Browse More Destinations
        </Button>
      </Box>
    </Paper>
  );
}