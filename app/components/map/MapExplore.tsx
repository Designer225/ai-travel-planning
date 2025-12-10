'use client';

import { startTransition, useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { MapPin, UtensilsCrossed, Bed, Compass, X } from "lucide-react";
import Button from "@mui/material/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Navigation } from "../layout/Navigation";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/app/lib/themes";
import { Destination, DestinationType } from "@/types";
import { toast } from "sonner";
import { tryEnterItineraryBuilder } from "@/app/lib/clientUserGate";
import { useRouter } from "next/navigation";

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
  
  // Paris, France (9 destinations)
  {
    id: 11,
    name: "Eiffel Tower",
    type: "attraction",
    lat: 48.8584,
    lng: 2.2945,
    description: "The iconic iron lattice tower, one of the most recognized structures in the world. Climb to the top for panoramic views of Paris or enjoy a picnic in the Champ de Mars below.",
    tags: ["Iconic", "Views", "Architecture"],
    rating: 4.7,
  },
  {
    id: 12,
    name: "Louvre Museum",
    type: "attraction",
    lat: 48.8606,
    lng: 2.3376,
    description: "The world's largest art museum, home to the Mona Lisa and thousands of other masterpieces. The glass pyramid entrance is an architectural marvel in itself.",
    tags: ["Museum", "Art", "Historic"],
    rating: 4.6,
  },
  {
    id: 13,
    name: "Notre-Dame Cathedral",
    type: "attraction",
    lat: 48.8530,
    lng: 2.3499,
    description: "A masterpiece of French Gothic architecture. While restoration continues after the 2019 fire, the exterior and surrounding area remain a must-see landmark.",
    tags: ["Cathedral", "Gothic", "Historic"],
    rating: 4.7,
  },
  {
    id: 14,
    name: "Le Comptoir du Relais",
    type: "food",
    lat: 48.8522,
    lng: 2.3376,
    description: "A celebrated bistro in Saint-Germain-des-Prés serving classic French cuisine. Chef Yves Camdeborde's modern take on traditional dishes has earned this spot a loyal following.",
    tags: ["French", "Bistro", "Fine Dining"],
    rating: 4.6,
    priceLevel: "$$$",
  },
  {
    id: 15,
    name: "L'As du Fallafel",
    type: "food",
    lat: 48.8575,
    lng: 2.3622,
    description: "A legendary falafel spot in the Marais district. The lines are long but move quickly, and the falafel pita is considered the best in Paris.",
    tags: ["Middle Eastern", "Casual", "Street Food"],
    rating: 4.5,
    priceLevel: "$",
  },
  {
    id: 16,
    name: "Ladurée",
    type: "food",
    lat: 48.8676,
    lng: 2.3264,
    description: "The world-famous patisserie known for inventing the double-decker macaron. Indulge in exquisite pastries, tea, and the quintessential Parisian café experience.",
    tags: ["Patisserie", "Dessert", "Iconic"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 17,
    name: "Hôtel Plaza Athénée",
    type: "lodging",
    lat: 48.8676,
    lng: 2.3014,
    description: "A legendary luxury hotel on Avenue Montaigne with stunning views of the Eiffel Tower. Features Michelin-starred dining, a Dior Institute spa, and impeccable service.",
    tags: ["Luxury", "Historic", "Spa"],
    rating: 4.8,
    priceLevel: "$$$$",
  },
  {
    id: 18,
    name: "Hôtel des Invalides",
    type: "lodging",
    lat: 48.8566,
    lng: 2.3122,
    description: "A charming boutique hotel near the Eiffel Tower. Features elegant rooms with Parisian charm, a cozy breakfast room, and excellent service.",
    tags: ["Boutique", "Charming", "Central"],
    rating: 4.5,
    priceLevel: "$$$",
  },
  {
    id: 19,
    name: "Le Meurice",
    type: "lodging",
    lat: 48.8656,
    lng: 2.3286,
    description: "A palace hotel facing the Tuileries Garden. Combines 18th-century elegance with contemporary art, featuring a three-Michelin-starred restaurant.",
    tags: ["Palace", "Luxury", "Art"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  
  // Tokyo, Japan (9 destinations)
  {
    id: 20,
    name: "Senso-ji Temple",
    type: "attraction",
    lat: 35.7148,
    lng: 139.7967,
    description: "Tokyo's oldest temple, founded in 628 AD. Walk through the vibrant Nakamise shopping street leading to the temple, where you can experience traditional Japanese culture and buy souvenirs.",
    tags: ["Temple", "Historic", "Shopping"],
    rating: 4.6,
  },
  {
    id: 21,
    name: "Shibuya Crossing",
    type: "attraction",
    lat: 35.6598,
    lng: 139.7006,
    description: "The world's busiest pedestrian crossing, where thousands of people cross simultaneously. Best viewed from the Shibuya Sky observation deck or surrounding cafes.",
    tags: ["Iconic", "Urban", "Photography"],
    rating: 4.5,
  },
  {
    id: 22,
    name: "Tsukiji Outer Market",
    type: "attraction",
    lat: 35.6654,
    lng: 139.7706,
    description: "A vibrant market area with fresh seafood, street food stalls, and traditional Japanese snacks. Experience authentic Tokyo food culture and sample fresh sushi.",
    tags: ["Market", "Food", "Cultural"],
    rating: 4.6,
  },
  {
    id: 23,
    name: "Sukiyabashi Jiro",
    type: "food",
    lat: 35.6654,
    lng: 139.7596,
    description: "The legendary sushi restaurant featured in 'Jiro Dreams of Sushi'. This tiny 10-seat counter offers an omakase experience that's considered one of the world's finest.",
    tags: ["Sushi", "Omakase", "Legendary"],
    rating: 4.9,
    priceLevel: "$$$$",
  },
  {
    id: 24,
    name: "Ichiran Ramen",
    type: "food",
    lat: 35.6598,
    lng: 139.7006,
    description: "A famous ramen chain known for its tonkotsu broth and private booth dining experience. Customize your ramen to your exact preferences.",
    tags: ["Ramen", "Casual", "Popular"],
    rating: 4.5,
    priceLevel: "$",
  },
  {
    id: 25,
    name: "Tsuta",
    type: "food",
    lat: 35.7148,
    lng: 139.7967,
    description: "The first ramen restaurant to receive a Michelin star. Known for its shoyu soba with truffle oil, creating a unique and luxurious ramen experience.",
    tags: ["Ramen", "Michelin", "Unique"],
    rating: 4.7,
    priceLevel: "$$",
  },
  {
    id: 26,
    name: "Park Hyatt Tokyo",
    type: "lodging",
    lat: 35.6580,
    lng: 139.7306,
    description: "Famous from 'Lost in Translation', this luxury hotel offers stunning city views, a world-class spa, and exceptional dining. Located in the vibrant Shinjuku district.",
    tags: ["Luxury", "Views", "Spa"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 27,
    name: "The Ritz-Carlton Tokyo",
    type: "lodging",
    lat: 35.6580,
    lng: 139.7306,
    description: "A luxury hotel in the Roppongi district with panoramic city views. Features multiple fine dining restaurants, a spa, and exceptional service.",
    tags: ["Luxury", "Roppongi", "Fine Dining"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  {
    id: 28,
    name: "Aman Tokyo",
    type: "lodging",
    lat: 35.6580,
    lng: 139.7306,
    description: "A minimalist luxury hotel with traditional Japanese design elements. Features serene spa facilities, exceptional service, and stunning views of the Imperial Palace gardens.",
    tags: ["Luxury", "Minimalist", "Spa"],
    rating: 4.8,
    priceLevel: "$$$$",
  },
  
  // New York, USA (9 destinations)
  {
    id: 29,
    name: "Statue of Liberty",
    type: "attraction",
    lat: 40.6892,
    lng: -74.0445,
    description: "A symbol of freedom and democracy, this iconic statue stands on Liberty Island. Take a ferry to visit the museum and climb to the crown for spectacular harbor views.",
    tags: ["Iconic", "Historic", "Museum"],
    rating: 4.6,
  },
  {
    id: 30,
    name: "Central Park",
    type: "attraction",
    lat: 40.7829,
    lng: -73.9654,
    description: "An 843-acre urban park in Manhattan. Features walking paths, lakes, gardens, and iconic landmarks like Bethesda Fountain and Strawberry Fields.",
    tags: ["Park", "Nature", "Iconic"],
    rating: 4.7,
  },
  {
    id: 31,
    name: "Empire State Building",
    type: "attraction",
    lat: 40.7484,
    lng: -73.9857,
    description: "An Art Deco skyscraper with observation decks on the 86th and 102nd floors. Offers breathtaking 360-degree views of New York City.",
    tags: ["Iconic", "Views", "Architecture"],
    rating: 4.6,
  },
  {
    id: 32,
    name: "Le Bernardin",
    type: "food",
    lat: 40.7614,
    lng: -73.9776,
    description: "A three-Michelin-starred seafood restaurant helmed by Chef Eric Ripert. Known for its innovative French-inspired seafood dishes and elegant atmosphere.",
    tags: ["Seafood", "Fine Dining", "Michelin"],
    rating: 4.8,
    priceLevel: "$$$$",
  },
  {
    id: 33,
    name: "Joe's Pizza",
    type: "food",
    lat: 40.7306,
    lng: -73.9982,
    description: "A Greenwich Village institution serving classic New York-style pizza since 1975. Thin crust, simple toppings, and that perfect NYC slice experience.",
    tags: ["Pizza", "Casual", "Iconic"],
    rating: 4.6,
    priceLevel: "$",
  },
  {
    id: 34,
    name: "Katz's Delicatessen",
    type: "food",
    lat: 40.7222,
    lng: -73.9875,
    description: "A legendary Lower East Side deli serving massive pastrami sandwiches since 1888. Featured in 'When Harry Met Sally' - try the pastrami on rye.",
    tags: ["Deli", "Historic", "Iconic"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 35,
    name: "The Plaza Hotel",
    type: "lodging",
    lat: 40.7648,
    lng: -73.9748,
    description: "A legendary Beaux-Arts hotel facing Central Park. This historic landmark has hosted presidents, royalty, and celebrities. Features luxurious rooms and world-class service.",
    tags: ["Historic", "Luxury", "Central Park"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 36,
    name: "The St. Regis New York",
    type: "lodging",
    lat: 40.7614,
    lng: -73.9776,
    description: "A luxury hotel on Fifth Avenue with butler service, elegant rooms, and proximity to major attractions. Features the renowned King Cole Bar.",
    tags: ["Luxury", "Butler Service", "Historic"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  {
    id: 37,
    name: "The Greenwich Hotel",
    type: "lodging",
    lat: 40.7222,
    lng: -73.9875,
    description: "A boutique hotel in Tribeca with individually designed rooms, a Japanese-inspired spa, and a cozy drawing room. Owned by Robert De Niro.",
    tags: ["Boutique", "Tribeca", "Spa"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  
  // London, UK (9 destinations)
  {
    id: 38,
    name: "Tower of London",
    type: "attraction",
    lat: 51.5081,
    lng: -0.0759,
    description: "A historic castle on the north bank of the River Thames. Home to the Crown Jewels, the White Tower, and centuries of British history. Beefeater tours bring the stories to life.",
    tags: ["Historic", "Castle", "Museum"],
    rating: 4.7,
  },
  {
    id: 39,
    name: "British Museum",
    type: "attraction",
    lat: 51.5194,
    lng: -0.1270,
    description: "One of the world's greatest museums, housing a vast collection of art and artifacts from around the globe. The Great Court is a stunning architectural feature.",
    tags: ["Museum", "Historic", "Art"],
    rating: 4.6,
  },
  {
    id: 40,
    name: "Buckingham Palace",
    type: "attraction",
    lat: 51.5014,
    lng: -0.1419,
    description: "The official residence of the British monarch. Watch the Changing of the Guard ceremony and tour the State Rooms during summer months.",
    tags: ["Palace", "Historic", "Royal"],
    rating: 4.5,
  },
  {
    id: 41,
    name: "Dishoom",
    type: "food",
    lat: 51.5154,
    lng: -0.0922,
    description: "A beloved Bombay-style café serving authentic Indian breakfast, lunch, and dinner. The bacon naan roll and black daal are legendary. Expect queues, but it's worth the wait.",
    tags: ["Indian", "Casual", "Popular"],
    rating: 4.6,
    priceLevel: "$$",
  },
  {
    id: 42,
    name: "The Ledbury",
    type: "food",
    lat: 51.5194,
    lng: -0.1270,
    description: "A two-Michelin-starred restaurant in Notting Hill. Chef Brett Graham creates innovative British cuisine with exceptional attention to detail.",
    tags: ["British", "Fine Dining", "Michelin"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 43,
    name: "Borough Market",
    type: "food",
    lat: 51.5054,
    lng: -0.0905,
    description: "One of London's oldest food markets, offering artisanal produce, street food, and gourmet treats. A foodie paradise with vendors from around the world.",
    tags: ["Market", "Street Food", "Gourmet"],
    rating: 4.6,
    priceLevel: "$$",
  },
  {
    id: 44,
    name: "The Savoy",
    type: "lodging",
    lat: 51.5094,
    lng: -0.1206,
    description: "A legendary luxury hotel on the Strand, overlooking the Thames. Opened in 1889, it combines Edwardian elegance with modern amenities. Home to the famous American Bar.",
    tags: ["Historic", "Luxury", "Riverside"],
    rating: 4.8,
    priceLevel: "$$$$",
  },
  {
    id: 45,
    name: "The Ritz London",
    type: "lodging",
    lat: 51.5074,
    lng: -0.1419,
    description: "An iconic luxury hotel in Piccadilly. Known for its afternoon tea, elegant rooms, and impeccable service. A symbol of British hospitality.",
    tags: ["Luxury", "Iconic", "Afternoon Tea"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 46,
    name: "The Connaught",
    type: "lodging",
    lat: 51.5094,
    lng: -0.1506,
    description: "A luxury hotel in Mayfair with Michelin-starred dining, a world-class spa, and elegant rooms. Combines traditional British charm with contemporary design.",
    tags: ["Luxury", "Mayfair", "Spa"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  
  // Rome, Italy (9 destinations)
  {
    id: 47,
    name: "Colosseum",
    type: "attraction",
    lat: 41.8902,
    lng: 12.4922,
    description: "The largest amphitheater ever built, this ancient Roman landmark hosted gladiator contests and public spectacles. Take a guided tour to explore the underground chambers and arena floor.",
    tags: ["Historic", "Ancient", "Architecture"],
    rating: 4.7,
  },
  {
    id: 48,
    name: "Vatican Museums",
    type: "attraction",
    lat: 41.9029,
    lng: 12.4544,
    description: "Home to the Sistine Chapel and one of the world's greatest art collections. The spiral staircase and Raphael Rooms are highlights alongside Michelangelo's masterpiece.",
    tags: ["Museum", "Art", "Historic"],
    rating: 4.8,
  },
  {
    id: 49,
    name: "Trevi Fountain",
    type: "attraction",
    lat: 41.9009,
    lng: 12.4833,
    description: "A stunning Baroque fountain and one of Rome's most famous landmarks. Toss a coin over your shoulder to ensure your return to the Eternal City.",
    tags: ["Fountain", "Baroque", "Iconic"],
    rating: 4.6,
  },
  {
    id: 50,
    name: "La Pergola",
    type: "food",
    lat: 41.9125,
    lng: 12.4564,
    description: "Rome's only three-Michelin-starred restaurant, located at the Rome Cavalieri hotel. Chef Heinz Beck creates innovative Italian cuisine with stunning views of the Eternal City.",
    tags: ["Italian", "Fine Dining", "Michelin"],
    rating: 4.8,
    priceLevel: "$$$$",
  },
  {
    id: 51,
    name: "Roscioli",
    type: "food",
    lat: 41.8969,
    lng: 12.4764,
    description: "A beloved deli and restaurant serving exceptional Roman cuisine. Known for its carbonara, cacio e pepe, and artisanal products. Part deli, part restaurant, all delicious.",
    tags: ["Italian", "Deli", "Roman"],
    rating: 4.6,
    priceLevel: "$$",
  },
  {
    id: 52,
    name: "Pizzarium",
    type: "food",
    lat: 41.9029,
    lng: 12.4544,
    description: "A pizza al taglio (pizza by the slice) shop by renowned chef Gabriele Bonci. Creative toppings and perfectly crispy Roman-style pizza.",
    tags: ["Pizza", "Casual", "Gourmet"],
    rating: 4.5,
    priceLevel: "$",
  },
  {
    id: 53,
    name: "Hotel de Russie",
    type: "lodging",
    lat: 41.9086,
    lng: 12.4764,
    description: "A luxury hotel between the Spanish Steps and Piazza del Popolo. Features a secret garden, elegant rooms, and a rooftop restaurant with panoramic city views.",
    tags: ["Luxury", "Garden", "Historic"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 54,
    name: "The First Roma Dolce",
    type: "lodging",
    lat: 41.9009,
    lng: 12.4833,
    description: "A luxury boutique hotel near the Trevi Fountain. Features modern design, a rooftop terrace with stunning views, and excellent service.",
    tags: ["Boutique", "Luxury", "Modern"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  {
    id: 55,
    name: "Villa San Pio",
    type: "lodging",
    lat: 41.8902,
    lng: 12.4922,
    description: "A charming hotel in a restored 19th-century villa. Features elegant rooms, a beautiful garden, and proximity to major attractions.",
    tags: ["Boutique", "Historic", "Garden"],
    rating: 4.5,
    priceLevel: "$$$",
  },
  
  // Barcelona, Spain (9 destinations)
  {
    id: 56,
    name: "Sagrada Família",
    type: "attraction",
    lat: 41.4036,
    lng: 2.1744,
    description: "Antoni Gaudí's unfinished masterpiece, a stunning basilica that's been under construction since 1882. The intricate facades and soaring interior are architectural marvels.",
    tags: ["Architecture", "Gaudí", "Iconic"],
    rating: 4.8,
  },
  {
    id: 57,
    name: "Park Güell",
    type: "attraction",
    lat: 41.4145,
    lng: 2.1527,
    description: "A colorful park designed by Gaudí with mosaic sculptures, winding paths, and stunning city views. The dragon staircase is a highlight.",
    tags: ["Park", "Gaudí", "Architecture"],
    rating: 4.6,
  },
  {
    id: 58,
    name: "La Rambla",
    type: "attraction",
    lat: 41.3809,
    lng: 2.1734,
    description: "A vibrant tree-lined pedestrian street in the heart of Barcelona. Features street performers, markets, cafes, and shops. A must-walk experience.",
    tags: ["Street", "Shopping", "Entertainment"],
    rating: 4.5,
  },
  {
    id: 59,
    name: "Tickets",
    type: "food",
    lat: 41.3954,
    lng: 2.1620,
    description: "A vibrant tapas bar by the Adrià brothers, creators of elBulli. Experience creative Spanish tapas in a fun, theatrical atmosphere. Reservations are essential.",
    tags: ["Tapas", "Creative", "Popular"],
    rating: 4.7,
    priceLevel: "$$$",
  },
  {
    id: 60,
    name: "Can Culleretes",
    type: "food",
    lat: 41.3809,
    lng: 2.1734,
    description: "Barcelona's oldest restaurant, serving traditional Catalan cuisine since 1786. Authentic dishes in a historic setting with old-world charm.",
    tags: ["Catalan", "Historic", "Traditional"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 61,
    name: "El Xampanyet",
    type: "food",
    lat: 41.3809,
    lng: 2.1827,
    description: "A legendary tapas bar in the Born district. Known for its cava, traditional tapas, and lively atmosphere. Get there early for a spot at the bar.",
    tags: ["Tapas", "Cava", "Local"],
    rating: 4.6,
    priceLevel: "$$",
  },
  {
    id: 62,
    name: "Hotel Casa Fuster",
    type: "lodging",
    lat: 41.3954,
    lng: 2.1620,
    description: "A Modernist masterpiece hotel on Passeig de Gràcia. Designed by Lluís Domènech i Montaner, it features elegant rooms, a rooftop pool, and excellent service.",
    tags: ["Modernist", "Luxury", "Historic"],
    rating: 4.6,
    priceLevel: "$$$",
  },
  {
    id: 63,
    name: "Hotel Arts Barcelona",
    type: "lodging",
    lat: 41.3888,
    lng: 2.1970,
    description: "A luxury beachfront hotel with stunning Mediterranean views. Features multiple restaurants, a spa, and direct beach access.",
    tags: ["Luxury", "Beachfront", "Spa"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 64,
    name: "El Palace Barcelona",
    type: "lodging",
    lat: 41.3809,
    lng: 2.1734,
    description: "A historic luxury hotel in the heart of Barcelona. Features elegant rooms, a rooftop pool with city views, and exceptional service.",
    tags: ["Luxury", "Historic", "Central"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  
  // Dubai, UAE (9 destinations)
  {
    id: 65,
    name: "Burj Khalifa",
    type: "attraction",
    lat: 25.1972,
    lng: 55.2744,
    description: "The world's tallest building at 828 meters. Visit the observation decks on the 124th and 148th floors for breathtaking views of Dubai and the Arabian Gulf.",
    tags: ["Iconic", "Views", "Architecture"],
    rating: 4.6,
  },
  {
    id: 66,
    name: "Burj Al Arab",
    type: "attraction",
    lat: 25.1412,
    lng: 55.1853,
    description: "The iconic sail-shaped hotel, one of the world's most luxurious. Even if not staying, visit for afternoon tea or to admire the architecture.",
    tags: ["Iconic", "Luxury", "Architecture"],
    rating: 4.7,
  },
  {
    id: 67,
    name: "Dubai Mall",
    type: "attraction",
    lat: 25.1984,
    lng: 55.2794,
    description: "One of the world's largest shopping malls with over 1,200 stores, an aquarium, ice rink, and entertainment complex. Adjacent to the Burj Khalifa.",
    tags: ["Shopping", "Entertainment", "Iconic"],
    rating: 4.5,
  },
  {
    id: 68,
    name: "Al Fanar Restaurant",
    type: "food",
    lat: 25.2048,
    lng: 55.2708,
    description: "An authentic Emirati restaurant serving traditional dishes in a heritage setting. Experience local flavors like machboos, harees, and luqaimat in a cultural atmosphere.",
    tags: ["Emirati", "Traditional", "Cultural"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 69,
    name: "Zuma Dubai",
    type: "food",
    lat: 25.1972,
    lng: 55.2744,
    description: "A contemporary Japanese restaurant in the heart of Dubai. Known for its innovative izakaya-style dining and vibrant atmosphere.",
    tags: ["Japanese", "Fine Dining", "Popular"],
    rating: 4.6,
    priceLevel: "$$$",
  },
  {
    id: 70,
    name: "Al Ustad Special Kabab",
    type: "food",
    lat: 25.2631,
    lng: 55.2972,
    description: "A legendary Iranian restaurant serving authentic kebabs since 1978. Simple, delicious, and a favorite among locals. Cash only.",
    tags: ["Iranian", "Kebab", "Local"],
    rating: 4.5,
    priceLevel: "$",
  },
  {
    id: 71,
    name: "Burj Al Arab",
    type: "lodging",
    lat: 25.1412,
    lng: 55.1853,
    description: "The iconic sail-shaped hotel, one of the world's most luxurious. Features opulent suites, private butlers, and exceptional dining including the underwater Al Mahara restaurant.",
    tags: ["Luxury", "Iconic", "Beachfront"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 72,
    name: "Atlantis The Palm",
    type: "lodging",
    lat: 25.1308,
    lng: 55.1178,
    description: "A luxury resort on the Palm Jumeirah with an underwater suite, waterpark, and multiple fine dining restaurants. Family-friendly with endless entertainment.",
    tags: ["Resort", "Family", "Luxury"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  {
    id: 73,
    name: "Armani Hotel Dubai",
    type: "lodging",
    lat: 25.1972,
    lng: 55.2744,
    description: "A luxury hotel designed by Giorgio Armani in the Burj Khalifa. Features minimalist elegance, exceptional service, and stunning city views.",
    tags: ["Luxury", "Design", "Modern"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  
  // Amsterdam, Netherlands (9 destinations)
  {
    id: 74,
    name: "Rijksmuseum",
    type: "attraction",
    lat: 52.3600,
    lng: 4.8852,
    description: "The Netherlands' national museum, home to masterpieces by Rembrandt, Vermeer, and Van Gogh. The stunning building and world-class collection make this a must-visit.",
    tags: ["Museum", "Art", "Historic"],
    rating: 4.7,
  },
  {
    id: 75,
    name: "Anne Frank House",
    type: "attraction",
    lat: 52.3752,
    lng: 4.8841,
    description: "The hiding place where Anne Frank wrote her famous diary during WWII. A moving and important historical site. Book tickets well in advance.",
    tags: ["Historic", "Museum", "Memorial"],
    rating: 4.6,
  },
  {
    id: 76,
    name: "Van Gogh Museum",
    type: "attraction",
    lat: 52.3584,
    lng: 4.8811,
    description: "The largest collection of Van Gogh's works in the world. Features over 200 paintings, 500 drawings, and 700 letters by the artist.",
    tags: ["Museum", "Art", "Van Gogh"],
    rating: 4.7,
  },
  {
    id: 77,
    name: "De Kas",
    type: "food",
    lat: 52.3567,
    lng: 4.9203,
    description: "A unique restaurant in a greenhouse serving farm-to-table Dutch cuisine. The seasonal menu features vegetables and herbs grown on-site, creating fresh, innovative dishes.",
    tags: ["Dutch", "Farm-to-Table", "Greenhouse"],
    rating: 4.6,
    priceLevel: "$$$",
  },
  {
    id: 78,
    name: "The Seafood Bar",
    type: "food",
    lat: 52.3600,
    lng: 4.8852,
    description: "A popular seafood restaurant serving fresh fish, oysters, and seafood platters. Casual atmosphere with excellent quality and reasonable prices.",
    tags: ["Seafood", "Casual", "Fresh"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 79,
    name: "Café de Reiger",
    type: "food",
    lat: 52.3752,
    lng: 4.8841,
    description: "A traditional Dutch 'brown café' serving classic Dutch dishes and local beers. Cozy atmosphere and authentic Amsterdam experience.",
    tags: ["Dutch", "Traditional", "Local"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 80,
    name: "The Dylan Amsterdam",
    type: "lodging",
    lat: 52.3702,
    lng: 4.8952,
    description: "A luxury boutique hotel in a 17th-century theater building. Features elegant rooms, a Michelin-starred restaurant, and a beautiful inner courtyard garden.",
    tags: ["Boutique", "Historic", "Luxury"],
    rating: 4.6,
    priceLevel: "$$$",
  },
  {
    id: 81,
    name: "Pulitzer Amsterdam",
    type: "lodging",
    lat: 52.3752,
    lng: 4.8841,
    description: "A luxury hotel spread across 25 restored 17th- and 18th-century canal houses. Features unique rooms, a beautiful garden, and excellent service.",
    tags: ["Luxury", "Historic", "Canal Houses"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 82,
    name: "Conservatorium Hotel",
    type: "lodging",
    lat: 52.3584,
    lng: 4.8811,
    description: "A luxury hotel in a former music conservatory. Features modern design, a world-class spa, and multiple fine dining restaurants.",
    tags: ["Luxury", "Modern", "Spa"],
    rating: 4.6,
    priceLevel: "$$$$",
  },
  
  // Bangkok, Thailand (9 destinations)
  {
    id: 83,
    name: "Wat Pho",
    type: "attraction",
    lat: 13.7465,
    lng: 100.4930,
    description: "The Temple of the Reclining Buddha, one of Bangkok's oldest and largest temples. Home to a 46-meter-long golden Buddha and the birthplace of Thai massage.",
    tags: ["Temple", "Historic", "Buddhist"],
    rating: 4.6,
  },
  {
    id: 84,
    name: "Grand Palace",
    type: "attraction",
    lat: 13.7500,
    lng: 100.4925,
    description: "The former royal residence and a stunning complex of buildings. Home to the Emerald Buddha and some of Thailand's most important architecture.",
    tags: ["Palace", "Historic", "Royal"],
    rating: 4.7,
  },
  {
    id: 85,
    name: "Chatuchak Weekend Market",
    type: "attraction",
    lat: 13.8000,
    lng: 100.5500,
    description: "One of the world's largest weekend markets with over 15,000 stalls. Find everything from clothing and antiques to street food and pets.",
    tags: ["Market", "Shopping", "Street Food"],
    rating: 4.5,
  },
  {
    id: 86,
    name: "Jay Fai",
    type: "food",
    lat: 13.7578,
    lng: 100.5022,
    description: "A legendary street food stall run by the 70+ year old 'wok queen' who earned a Michelin star. Famous for her crab omelet and drunken noodles. Expect long waits.",
    tags: ["Street Food", "Michelin", "Local"],
    rating: 4.5,
    priceLevel: "$$",
  },
  {
    id: 87,
    name: "Gaggan",
    type: "food",
    lat: 13.7500,
    lng: 100.4925,
    description: "A progressive Indian restaurant that was ranked Asia's best. Known for its innovative molecular gastronomy and emoji menu.",
    tags: ["Indian", "Fine Dining", "Creative"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 88,
    name: "Thip Samai",
    type: "food",
    lat: 13.7465,
    lng: 100.4930,
    description: "A legendary pad thai restaurant that's been serving since 1966. Known for its signature pad thai wrapped in an egg omelet. Lines are always long.",
    tags: ["Thai", "Pad Thai", "Iconic"],
    rating: 4.6,
    priceLevel: "$",
  },
  {
    id: 89,
    name: "The Siam",
    type: "lodging",
    lat: 13.7589,
    lng: 100.4944,
    description: "A luxury riverside hotel with Art Deco design and private pool villas. Features a spa, fine dining, and a private boat for exploring the Chao Phraya River.",
    tags: ["Luxury", "Riverside", "Boutique"],
    rating: 4.7,
    priceLevel: "$$$$",
  },
  {
    id: 90,
    name: "Mandarin Oriental Bangkok",
    type: "lodging",
    lat: 13.7244,
    lng: 100.5156,
    description: "A legendary luxury hotel on the Chao Phraya River. Features traditional Thai architecture, world-class spa, and exceptional service since 1876.",
    tags: ["Luxury", "Historic", "Riverside"],
    rating: 4.8,
    priceLevel: "$$$$",
  },
  {
    id: 91,
    name: "The Peninsula Bangkok",
    type: "lodging",
    lat: 13.7244,
    lng: 100.5156,
    description: "A luxury hotel on the river with stunning views, multiple restaurants, and a world-class spa. Features traditional Thai hospitality with modern amenities.",
    tags: ["Luxury", "Riverside", "Spa"],
    rating: 4.7,
    priceLevel: "$$$$",
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
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<DestinationType | "all">("all");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]);
  const [zoom, setZoom] = useState(13);
  const [showLocationsDialog, setShowLocationsDialog] = useState(false);

  const locations = [
    { name: "San Francisco, USA", count: 10, lat: 37.7749, lng: -122.4194 },
    { name: "Paris, France", count: 9, lat: 48.8566, lng: 2.3522 },
    { name: "Tokyo, Japan", count: 9, lat: 35.6762, lng: 139.6503 },
    { name: "New York, USA", count: 9, lat: 40.7128, lng: -74.0060 },
    { name: "London, UK", count: 9, lat: 51.5074, lng: -0.1278 },
    { name: "Rome, Italy", count: 9, lat: 41.9028, lng: 12.4964 },
    { name: "Barcelona, Spain", count: 9, lat: 41.3851, lng: 2.1734 },
    { name: "Dubai, UAE", count: 9, lat: 25.2048, lng: 55.2708 },
    { name: "Amsterdam, Netherlands", count: 9, lat: 52.3676, lng: 4.9041 },
    { name: "Bangkok, Thailand", count: 9, lat: 13.7563, lng: 100.5018 },
  ];

  const handleLocationClick = (location: { name: string; lat: number; lng: number }) => {
    setMapCenter([location.lat, location.lng]);
    setZoom(12); // Zoom in to city level
    setShowLocationsDialog(false);
    toast.success(`Navigating to ${location.name}`);
  };

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

  const handleAddToItinerary = () => {
    if (selectedDestination === null) return;
    toast.message('Adding to the current itinerary...');
    console.log('Adding to itinerary:', selectedDestination);
    startTransition(async () => {
      await tryEnterItineraryBuilder(router, selectedDestination.id);
    });
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <ThemeProvider theme={theme}>
        {/* Header with filters */}
        <header className="bg-white border-b p-4 shadow-sm">
          <Navigation />
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl">Explore Destinations</h1>
              </div>
              <Badge 
                variant="outline" 
                className="text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setShowLocationsDialog(true)}
              >
                {filteredDestinations.length} locations
              </Badge>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant='outlined'
                onClick={() => setSelectedType("all")}
                size="small"
                sx={{
                  gap: 1,
                  transition: 'all',
                  ... selectedType === "all" ? {
                    color: '#fff',
                    backgroundColor: '#000',
                    borderColor: '#000',
                    ":hover": {
                      backgroundColor: '#333',
                    }
                  } : {
                    color: '#000',
                    borderColor: '#00000030',
                    ":hover": {
                      backgroundColor: '#00000010',
                      borderColor: '#000'
                    } 
                  }
                }}
              >
                All Destinations
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedType("attraction")}
                size="small"
                sx={{
                  gap: 1,
                  transition: 'all',
                  ... selectedType === "attraction" ? {
                    color: '#fff',
                    backgroundColor: '#FF6B6B',
                    borderColor: '#FF6B6B',
                    ":hover": {
                      backgroundColor: '#FF5252'
                    }
                  } : {
                    color: '#FF6B6B',
                    borderColor: '#FF6B6B30',
                    ":hover": {
                      backgroundColor: '#FF6B6B10',
                      borderColor: '#FF6B6B'
                    } 
                  }
                }}
              >
                <Compass className="h-4 w-4" />
                Attractions
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedType("food")}
                size="small"
                sx={{
                  gap: 1,
                  transition: 'all',
                  ... selectedType === "food" ? {
                    color: '#fff',
                    backgroundColor: '#4ECDC4',
                    borderColor: '#4ECDC4',
                    ":hover": {
                      backgroundColor: '#3EBDB4'
                    }
                  } : {
                    color: '#4ECDC4',
                    borderColor: '#4ECDC430',
                    ":hover": {
                      backgroundColor: '#4ECDC410',
                      borderColor: '#4ECDC4'
                    } 
                  }
                }}
              >
                <UtensilsCrossed className="h-4 w-4" />
                Food & Dining
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedType("lodging")}
                size="small"
                sx={{
                  gap: 1,
                  transition: 'all',
                  ... selectedType === "lodging" ? {
                    color: '#fff',
                    backgroundColor: '#FFD93D',
                    borderColor: '#FFD93D',
                    ":hover": {
                      backgroundColor: '#FFC91D',
                      color: '#212121'
                    }
                  } : {
                    color: '#FFD93D',
                    borderColor: '#FFD93D30',
                    ":hover": {
                      backgroundColor: '#FFD93D10',
                      borderColor: '#FFD93D'
                    } 
                  }
                }}
              >
                <Bed className="h-4 w-4" />
                Lodging
              </Button>
            </div>
          </div>
        </header>

        {/* Map */}
        <main className="flex-1 relative">
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
        </main>

        {/* Locations Dialog */}
        <Dialog open={showLocationsDialog} onOpenChange={setShowLocationsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Available Locations</DialogTitle>
              <DialogDescription>
                We offer destinations in {locations.length} top tourist cities around the world.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {locations.map((location, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationClick(location)}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{location.name}</span>
                  </div>
                  <Badge variant="secondary">{location.count} destinations</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Destination Details Dialog */}
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
              <Button className="flex-1" onClick={handleAddToItinerary}>Add to Itinerary</Button>
              <Button variant="outline" className="flex-1">Get Directions</Button>
            </div>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}
