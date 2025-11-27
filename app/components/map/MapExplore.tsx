'use client';

import { useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { MapPin, UtensilsCrossed, Bed, Compass, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Navigation } from "../layout/Navigation";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/app/lib/themes";

export type DestinationType = "attraction" | "food" | "lodging";

export interface Destination {
  id: number;
  name: string;
  type: DestinationType;
  lat: number;
  lng: number;
  description: string;
  tags: string[];
  rating: number;
  priceLevel?: string;
}

// Mock data for destinations
const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Golden Gate Bridge",
    type: "attraction",
    lat: 37.8199,
    lng: -122.4783,
    description: "An iconic suspension bridge spanning the Golden Gate strait, offering breathtaking views of San Francisco Bay. Perfect for photography, walking, or cycling across its 1.7-mile span. The bridge's International Orange color was specifically chosen to make it visible through San Francisco's famous fog.",
    tags: ["Iconic", "Photography", "Walking"],
    rating: 4.8,
  },
  {
    id: 2,
    name: "Fisherman's Wharf",
    type: "attraction",
    lat: 37.8080,
    lng: -122.4177,
    description: "A bustling waterfront neighborhood known for its seafood restaurants, sea lions at Pier 39, and historic maritime attractions. Enjoy street performances, visit the Maritime Museum, or take a ferry to Alcatraz Island from here.",
    tags: ["Waterfront", "Shopping", "Entertainment"],
    rating: 4.5,
  },
  {
    id: 3,
    name: "Tartine Bakery",
    type: "food",
    lat: 37.7611,
    lng: -122.4242,
    description: "A legendary bakery renowned for its morning buns, country bread, and croissants. Lines form early, but locals agree the wait is worth it. The sourdough bread here has achieved cult status among bread enthusiasts worldwide. Arrive early for the best selection.",
    tags: ["Bakery", "Breakfast", "Artisan"],
    rating: 4.7,
    priceLevel: "$$",
  },
  {
    id: 4,
    name: "State Bird Provisions",
    type: "food",
    lat: 37.7849,
    lng: -122.4294,
    description: "A James Beard Award-winning restaurant featuring innovative dim sum-style American cuisine. Dishes are served from roaming carts, creating an interactive dining experience. The signature state bird with provisions is a must-try. Reservations are highly competitive.",
    tags: ["Fine Dining", "American", "Creative"],
    rating: 4.6,
    priceLevel: "$$$",
  },
  {
    id: 5,
    name: "Hotel Zephyr",
    type: "lodging",
    lat: 37.8087,
    lng: -122.4156,
    description: "A nautical-themed hotel steps from Fisherman's Wharf with modern amenities and stunning bay views. Features a unique waterfront courtyard with fire pits, games, and bay breezes. Perfect location for exploring the wharf, Pier 39, and Alcatraz.",
    tags: ["Waterfront", "Modern", "Family-Friendly"],
    rating: 4.4,
    priceLevel: "$$$",
  },
  {
    id: 6,
    name: "Hotel Nikko",
    type: "lodging",
    lat: 37.7855,
    lng: -122.4070,
    description: "An upscale downtown hotel offering Japanese-inspired hospitality with contemporary comfort. Features include a rooftop pool, modern fitness center, and easy access to Union Square shopping. Known for exceptional service and attention to detail.",
    tags: ["Luxury", "Downtown", "Pool"],
    rating: 4.5,
    priceLevel: "$$$$",
  },
  {
    id: 7,
    name: "Alcatraz Island",
    type: "attraction",
    lat: 37.8267,
    lng: -122.4230,
    description: "The infamous former federal penitentiary that housed some of America's most notorious criminals. Take an audio tour narrated by former guards and inmates, exploring the cellblocks and learning about famous escape attempts. Book tickets weeks in advance as they sell out quickly.",
    tags: ["Historic", "Museum", "Tour"],
    rating: 4.9,
  },
  {
    id: 8,
    name: "La Taqueria",
    type: "food",
    lat: 37.7489,
    lng: -122.4177,
    description: "A Mission District institution serving what many consider the best burrito in San Francisco. No rice in their burritos â€“ just quality meat, beans, cheese, and perfectly balanced flavors. The carne asada is legendary, and the homemade salsa adds the perfect kick.",
    tags: ["Mexican", "Casual", "Local Favorite"],
    rating: 4.8,
    priceLevel: "$",
  },
  {
    id: 9,
    name: "Palace of Fine Arts",
    type: "attraction",
    lat: 37.8021,
    lng: -122.4486,
    description: "A stunning Greco-Roman style monument originally built for the 1915 Panama-Pacific Exposition. The rotunda and colonnades are reflected in a serene lagoon, creating a peaceful urban oasis. Popular for weddings, photo shoots, and leisurely strolls.",
    tags: ["Architecture", "Photography", "Peaceful"],
    rating: 4.7,
  },
  {
    id: 10,
    name: "Zuni CafÃ©",
    type: "food",
    lat: 37.7769,
    lng: -122.4242,
    description: "An iconic San Francisco restaurant famous for its wood-fired rotisserie chicken and house-baked focaccia. The open kitchen and bustling atmosphere create an energetic dining experience. Their Caesar salad and burger are also highly acclaimed.",
    tags: ["American", "Wine Bar", "Classic"],
    rating: 4.6,
    priceLevel: "$$$",
  },
];

// Custom marker component
function CustomMarker({ 
  type, 
  isActive, 
  onClick 
}: { 
  type: DestinationType; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const colors = {
    attraction: "#FF6B6B",
    food: "#4ECDC4",
    lodging: "#FFD93D",
  };

  const size = isActive ? 28 : 22;
  const color = colors[type];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        pointerEvents: "auto",
        zIndex: isActive ? 1000 : 10,
      }}
    >
      {/* Main pin circle */}
      <div
        style={{
          backgroundColor: color,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: `${isActive ? 4 : 3}px solid white`,
          boxShadow: isActive 
            ? `0 4px 16px rgba(0,0,0,0.5), 0 0 0 4px ${color}40` 
            : "0 3px 10px rgba(0,0,0,0.4)",
          transition: "all 0.2s ease",
          transform: isActive ? "scale(1.2)" : "scale(1)",
        }}
      />
      {/* Bottom pointer */}
      <div
        style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `8px solid ${color}`,
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function MapExplore() {
  const [selectedType, setSelectedType] = useState<DestinationType | "all">("all");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [zoom, setZoom] = useState(13);

  const filteredDestinations = selectedType === "all" 
    ? mockDestinations 
    : mockDestinations.filter(d => d.type === selectedType);

  const handleMarkerClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setMapCenter([destination.lat, destination.lng]);
  };

  const getTypeIcon = (type: DestinationType) => {
    switch (type) {
      case "attraction":
        return <Compass className="h-4 w-4" />;
      case "food":
        return <UtensilsCrossed className="h-4 w-4" />;
      case "lodging":
        return <Bed className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: DestinationType) => {
    switch (type) {
      case "attraction":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "food":
        return "bg-teal-500/10 text-teal-700 border-teal-200";
      case "lodging":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <ThemeProvider theme={theme}>
        {/* Header with filters */}
        <div className="bg-white border-b p-4 shadow-sm">
          <Navigation />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl">Explore Destinations</h1>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredDestinations.length} locations
              </Badge>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                onClick={() => setSelectedType("all")}
                size="sm"
              >
                All Destinations
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedType("attraction")}
                size="sm"
                className={`gap-2 transition-all ${
                  selectedType === "attraction" 
                    ? "bg-[#FF6B6B] text-white border-[#FF6B6B] hover:bg-[#FF5252] hover:text-white" 
                    : "border-[#FF6B6B]/30 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:border-[#FF6B6B]"
                }`}
              >
                <Compass className="h-4 w-4" />
                Attractions
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedType("food")}
                size="sm"
                className={`gap-2 transition-all ${
                  selectedType === "food" 
                    ? "bg-[#4ECDC4] text-white border-[#4ECDC4] hover:bg-[#3EBDB4] hover:text-white" 
                    : "border-[#4ECDC4]/30 text-[#4ECDC4] hover:bg-[#4ECDC4]/10 hover:border-[#4ECDC4]"
                }`}
              >
                <UtensilsCrossed className="h-4 w-4" />
                Food & Dining
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedType("lodging")}
                size="sm"
                className={`gap-2 transition-all ${
                  selectedType === "lodging" 
                    ? "bg-[#FFD93D] text-gray-900 border-[#FFD93D] hover:bg-[#FFC91D] hover:text-gray-900" 
                    : "border-[#FFD93D]/30 text-[#FFD93D] hover:bg-[#FFD93D]/10 hover:border-[#FFD93D]"
                }`}
              >
                <Bed className="h-4 w-4" />
                Lodging
              </Button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map 
            center={mapCenter} 
            zoom={zoom} 
            onBoundsChanged={({ center, zoom }) => {
              setMapCenter(center);
              setZoom(zoom);
            }}
            provider={(x, y, z) => {
              // Using Carto Voyager tiles for a cleaner, Google Maps-like appearance
              return `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}@2x.png`;
            }}
            attribution={false}
          >
            {filteredDestinations.map((destination) => (
              <Marker
                key={destination.id}
                anchor={[destination.lat, destination.lng]}
                offset={[0, 20]}
              >
                <CustomMarker
                  type={destination.type}
                  isActive={selectedDestination?.id === destination.id}
                  onClick={() => handleMarkerClick(destination)}
                />
              </Marker>
            ))}
          </Map>
        </div>

        {/* Modal Dialog */}
        <Dialog open={!!selectedDestination} onOpenChange={() => setSelectedDestination(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-2xl mb-2">{selectedDestination?.name}</DialogTitle>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge 
                      variant="outline" 
                      className={`gap-1 ${selectedDestination ? getTypeColor(selectedDestination.type) : ''}`}
                    >
                      {selectedDestination && getTypeIcon(selectedDestination.type)}
                      {selectedDestination?.type}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      â­ {selectedDestination?.rating}
                    </Badge>
                    {selectedDestination?.priceLevel && (
                      <Badge variant="outline">{selectedDestination.priceLevel}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <DialogDescription className="text-base text-gray-700 leading-relaxed">
              {selectedDestination?.description}
            </DialogDescription>

            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDestination?.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

  

            <div className="flex gap-2 mt-4">
              <Button className="flex-1">Add to Itinerary</Button>
              <Button variant="outline" className="flex-1">Get Directions</Button>
            </div>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
