'use client';

import { startTransition, useEffect, useState } from "react";
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
import { getUserTrips } from "@/app/lib/tripActions";
import { toast } from "sonner";

interface TripCardTrip {
  id: number;
  destination: string;
  dates: string;
  duration: string;
  activities: number;
  image: string;
}

function TripCard({ trip, isPast }: { trip: TripCardTrip; isPast: boolean }) {
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
  const [upcomingTrips, setUpcomingTrips] = useState<TripCardTrip[]>([]);
  const [pastTrips, setPastTrips] = useState<TripCardTrip[]>([]);
  const [savedTrips, setSavedTrips] = useState<TripCardTrip[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const router = useRouter();

  const mapBackendTripToCardTrip = (trip: {
    id: number;
    destination: string;
    title: string;
    dateRange?: string;
    tripTime: string;
    activities: number;
    imageUrl: string;
  }): TripCardTrip => ({
    id: trip.id,
    destination: trip.title || trip.destination,
    dates: trip.dateRange || "Dates TBD",
    duration: trip.tripTime || "TBD",
    activities: trip.activities,
    image: trip.imageUrl || "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=400&h=200&fit=crop",
  });

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const [upcomingResult, pastResult, savedResult] = await Promise.all([
          getUserTrips('upcoming'),
          getUserTrips('past'),
          getUserTrips('saved'),
        ]);

        if (upcomingResult.success && upcomingResult.trips) {
          setUpcomingTrips(upcomingResult.trips.map(mapBackendTripToCardTrip));
        } else {
          setUpcomingTrips([]);
        }

        if (pastResult.success && pastResult.trips) {
          setPastTrips(pastResult.trips.map(mapBackendTripToCardTrip));
        } else {
          setPastTrips([]);
        }

        if (savedResult.success && savedResult.trips) {
          setSavedTrips(savedResult.trips.map(mapBackendTripToCardTrip));
        } else {
          setSavedTrips([]);
        }

        if (!upcomingResult.success || !pastResult.success || !savedResult.success) {
          toast.error('Some trips could not be loaded');
        }
      } catch (error) {
        console.error('Failed to load trips for account widget', error);
        toast.error('Failed to load trips');
        setUpcomingTrips([]);
        setPastTrips([]);
        setSavedTrips([]);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

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

      {loading && (
        <Typography variant="body2" sx={{ mb: 2, color: "#4a5565" }}>
          Loading your trips...
        </Typography>
      )}

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
          {upcomingTrips.length === 0 && !loading && (
            <Typography variant="body2" color="text.secondary">
              No upcoming trips yet.
            </Typography>
          )}
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={false} />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {pastTrips.length === 0 && !loading && (
            <Typography variant="body2" color="text.secondary">
              No past trips yet.
            </Typography>
          )}
          {pastTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} isPast={true} />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {savedTrips.length === 0 && !loading && (
            <Typography variant="body2" color="text.secondary">
              No saved trips yet.
            </Typography>
          )}
          {savedTrips.map((trip) => (
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