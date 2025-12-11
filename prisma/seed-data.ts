// Auto-generated seed data from local database
// Add this to your prisma/seed.ts file

import { PrismaClient, TripStatus, ActivityCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedLocalData() {

  // User: john.smith@gmail.com
  const user_1 = await prisma.user.upsert({
    where: { email: 'john.smith@gmail.com' },
    update: {
      passwordHash: '$2b$10$XRsZWlVN3GlFa59oJfZbB.LSE1sGDfr3Cx4DJO7tfNCz4m/yunlkO',
      firstName: 'Bill',
      lastName: 'Smith',
      bio: "Travel Enthusiast",
      location: "San Francisco, CA",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
    create: {
      email: 'john.smith@gmail.com',
      passwordHash: '$2b$10$XRsZWlVN3GlFa59oJfZbB.LSE1sGDfr3Cx4DJO7tfNCz4m/yunlkO',
      firstName: 'Bill',
      lastName: 'Smith',
      bio: "Travel Enthusiast",
      location: "San Francisco, CA",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
  });

  console.log('Seeded user:', user_1.email);

  // Trip: Tokyo, Japan
  const trip_1 = await prisma.trip.upsert({
    where: { 
      id: 1 
    },
    update: {
      userId: user_1.id,
      title: "Tokyo, Japan",
      destination: "Tokyo, Japan",
      startDate: new Date('2025-04-01T00:00:00.000Z'),
      endDate: new Date('2025-04-05T00:00:00.000Z'),
      budget: "$2,000 - $2,500",
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
    },
    create: {
      userId: user_1.id,
      title: "Tokyo, Japan",
      destination: "Tokyo, Japan",
      startDate: new Date('2025-04-01T00:00:00.000Z'),
      endDate: new Date('2025-04-05T00:00:00.000Z'),
      budget: "$2,000 - $2,500",
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
      days: {
        create: [
          {
            dayNumber: 1,
            date: "April 1, 2025",
            title: "Arrival & Shibuya Exploration",
            activities: {
              create: [
                {
                  time: "14:00",
                  title: "Arrive at Narita Airport",
                  description: "Take the Narita Express to Shibuya Station (90 min, Â¥3,250)",
                  location: null,
                  category: ActivityCategory.transport,
                  order: 0,
                },
                {
                  time: "16:00",
                  title: "Check-in at Hotel",
                  description: "Hotel in Shibuya district",
                  location: "Shibuya",
                  category: ActivityCategory.accommodation,
                  order: 0,
                },
                {
                  time: "18:00",
                  title: "Shibuya Crossing & Hachiko Statue",
                  description: "Experience the world's busiest pedestrian crossing",
                  location: "Shibuya",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "20:00",
                  title: "Dinner at Ichiran Ramen",
                  description: "Famous tonkotsu ramen in private booth",
                  location: "Shibuya",
                  category: ActivityCategory.food,
                  order: 0,
                },
                {
                  time: "10:00",
                  title: "Hotel and Sleep",
                  description: "Add details about this activity",
                  location: null,
                  category: ActivityCategory.other,
                  order: 0,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            date: "April 2, 2025",
            title: "Traditional Tokyo - Asakusa & Ueno",
            activities: {
              create: [
                {
                  time: "09:00",
                  title: "Visit Senso-ji Temple",
                  description: "Tokyo's oldest temple with traditional shopping street",
                  location: "Asakusa",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "12:00",
                  title: "Lunch at Nakamise Shopping Street",
                  description: "Try traditional snacks and street food",
                  location: "Asakusa",
                  category: ActivityCategory.food,
                  order: 0,
                },
                {
                  time: "14:00",
                  title: "Ueno Park & Museums",
                  description: "Visit museums or enjoy cherry blossoms if in season",
                  location: "Ueno",
                  category: ActivityCategory.activity,
                  order: 0,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            date: "April 3, 2025",
            title: "Modern Tokyo - Harajuku & Shinjuku",
            activities: {
              create: [
                {
                  time: "10:00",
                  title: "Meiji Shrine",
                  description: "Peaceful Shinto shrine in forested area",
                  location: "Harajuku",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "12:00",
                  title: "Takeshita Street Shopping",
                  description: "Trendy fashion and quirky shops",
                  location: "Harajuku",
                  category: ActivityCategory.activity,
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_1.title);

  // Trip: Tokyo Spring Adventure
  const trip_2 = await prisma.trip.upsert({
    where: { 
      id: 2 
    },
    update: {
      userId: user_1.id,
      title: "Tokyo Spring Adventure",
      destination: "New York City",
      startDate: new Date('2025-04-01T00:00:00.000Z'),
      endDate: new Date('2025-04-07T00:00:00.000Z'),
      budget: "$2,000 - $2,500",
      travelers: 2,
      status: TripStatus.UPCOMING,
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
    },
    create: {
      userId: user_1.id,
      title: "Tokyo Spring Adventure",
      destination: "New York City",
      startDate: new Date('2025-04-01T00:00:00.000Z'),
      endDate: new Date('2025-04-07T00:00:00.000Z'),
      budget: "$2,000 - $2,500",
      travelers: 2,
      status: TripStatus.UPCOMING,
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
      days: {
        create: [
          {
            dayNumber: 1,
            date: "2026-02-18",
            title: "New Day",
            activities: {
              create: [
                {
                  time: "07:00",
                  title: "Wake Up",
                  description: "Add details about this activity",
                  location: null,
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "10:00",
                  title: "Flight",
                  description: "Add details about this activity",
                  location: null,
                  category: ActivityCategory.transport,
                  order: 1,
                },
                {
                  time: "19:30",
                  title: "Bed",
                  description: "Add details about this activity",
                  location: null,
                  category: ActivityCategory.activity,
                  order: 2,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            date: null,
            title: "New Day",
            activities: {
              create: [
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_2.title);

  // Trip: Romantic Paris Getaway
  const trip_3 = await prisma.trip.upsert({
    where: { 
      id: 3 
    },
    update: {
      userId: user_1.id,
      title: "Romantic Paris Getaway",
      destination: "Paris, France",
      startDate: new Date('2024-01-10T00:00:00.000Z'),
      endDate: new Date('2024-01-17T00:00:00.000Z'),
      budget: "$1,500 - $2,000",
      travelers: 2,
      status: TripStatus.PAST,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop",
    },
    create: {
      userId: user_1.id,
      title: "Romantic Paris Getaway",
      destination: "Paris, France",
      startDate: new Date('2024-01-10T00:00:00.000Z'),
      endDate: new Date('2024-01-17T00:00:00.000Z'),
      budget: "$1,500 - $2,000",
      travelers: 2,
      status: TripStatus.PAST,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop",
      days: {
        create: [
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_3.title);

  // Trip: Bali Dream Escape
  const trip_4 = await prisma.trip.upsert({
    where: { 
      id: 4 
    },
    update: {
      userId: user_1.id,
      title: "Bali Dream Escape",
      destination: "Destination 10",
      startDate: null,
      endDate: null,
      budget: "$1,800 - $2,200",
      travelers: 2,
      status: TripStatus.SAVED,
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop",
    },
    create: {
      userId: user_1.id,
      title: "Bali Dream Escape",
      destination: "Destination 10",
      startDate: null,
      endDate: null,
      budget: "$1,800 - $2,200",
      travelers: 2,
      status: TripStatus.SAVED,
      imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop",
      days: {
        create: [
          {
            dayNumber: 1,
            date: null,
            title: "New Day",
            activities: {
              create: [
                {
                  time: "20:00",
                  title: "Flight Arrival",
                  description: "Add details about this activity",
                  location: "Bali, Indonesia",
                  category: ActivityCategory.transport,
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_4.title);

  // Trip: New York
  const trip_5 = await prisma.trip.upsert({
    where: { 
      id: 5 
    },
    update: {
      userId: user_1.id,
      title: "New York",
      destination: "New York",
      startDate: new Date('2027-12-03T00:00:00.000Z'),
      endDate: new Date('2027-12-12T00:00:00.000Z'),
      budget: null,
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
    },
    create: {
      userId: user_1.id,
      title: "New York",
      destination: "New York",
      startDate: new Date('2027-12-03T00:00:00.000Z'),
      endDate: new Date('2027-12-12T00:00:00.000Z'),
      budget: null,
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
      days: {
        create: [
          {
            dayNumber: 1,
            date: null,
            title: "Day 1",
            activities: {
              create: [
                {
                  time: "10:00",
                  title: "Eat a Chopped Cheese",
                  description: "Add details about this activity",
                  location: null,
                  category: ActivityCategory.activity,
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_5.title);

  // Trip: London Winter Getaway
  const trip_6 = await prisma.trip.upsert({
    where: { 
      id: 6 
    },
    update: {
      userId: user_1.id,
      title: "London Winter Getaway",
      destination: "London, United Kingdom",
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-01-05T00:00:00.000Z'),
      budget: null,
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
    },
    create: {
      userId: user_1.id,
      title: "London Winter Getaway",
      destination: "London, United Kingdom",
      startDate: new Date('2026-01-01T00:00:00.000Z'),
      endDate: new Date('2026-01-05T00:00:00.000Z'),
      budget: null,
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
      days: {
        create: [
          {
            dayNumber: 1,
            date: "2026-01-01",
            title: "Arrival and Royal Exploration",
            activities: {
              create: [
                {
                  time: "11:00",
                  title: "Arrive at Heathrow Airport (LHR)",
                  description: "Arrive at London Heathrow Airport and clear immigration and customs.",
                  location: null,
                  category: ActivityCategory.transport,
                  order: 0,
                },
                {
                  time: "12:30",
                  title: "Heathrow Express to Paddington Station",
                  description: "Take the Heathrow Express for a quick and efficient transfer to central London.",
                  location: "Heathrow Airport",
                  category: ActivityCategory.transport,
                  order: 1,
                },
                {
                  time: "13:30",
                  title: "Check into Hotel",
                  description: "Check into your hotel near Paddington Station and leave your luggage.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.accommodation,
                  order: 2,
                },
                {
                  time: "14:00",
                  title: "Lunch in Paddington",
                  description: "Enjoy a casual lunch at a local pub or cafe.",
                  location: "Paddington Area",
                  category: ActivityCategory.food,
                  order: 3,
                },
                {
                  time: "15:00",
                  title: "Visit Buckingham Palace",
                  description: "See the iconic Buckingham Palace, the official residence of the monarch.",
                  location: "Buckingham Palace",
                  category: ActivityCategory.activity,
                  order: 4,
                },
                {
                  time: "16:30",
                  title: "Stroll through St. James's Park",
                  description: "Enjoy a leisurely walk in one of London's most beautiful Royal Parks.",
                  location: "St. James's Park",
                  category: ActivityCategory.activity,
                  order: 5,
                },
                {
                  time: "18:00",
                  title: "Westminster Abbey and Houses of Parliament",
                  description: "Admire the stunning architecture of Westminster Abbey and the Houses of Parliament from the outside.",
                  location: "Westminster",
                  category: ActivityCategory.activity,
                  order: 6,
                },
                {
                  time: "19:30",
                  title: "Dinner in Westminster",
                  description: "Have dinner at a restaurant in the Westminster area.",
                  location: "Westminster",
                  category: ActivityCategory.food,
                  order: 7,
                },
                {
                  time: "21:00",
                  title: "Return to Hotel",
                  description: "Head back to your hotel for a restful night.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.accommodation,
                  order: 8,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            date: "2026-01-02",
            title: "Museums and Culture",
            activities: {
              create: [
                {
                  time: "22:30",
                  title: "Return to Hotel",
                  description: "Travel back to your accommodation.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.accommodation,
                  order: 6,
                },
                {
                  time: "09:30",
                  title: "Morning at the British Museum",
                  description: "Explore vast collections of world art and artifacts.",
                  location: "British Museum",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "12:30",
                  title: "Lunch near the British Museum",
                  description: "Grab lunch at a cafe or restaurant in Bloomsbury.",
                  location: "Bloomsbury",
                  category: ActivityCategory.food,
                  order: 1,
                },
                {
                  time: "14:00",
                  title: "National Gallery",
                  description: "Discover masterpieces of European painting from the 13th to the 19th centuries.",
                  location: "National Gallery, Trafalgar Square",
                  category: ActivityCategory.activity,
                  order: 2,
                },
                {
                  time: "17:00",
                  title: "Explore Trafalgar Square",
                  description: "Enjoy the atmosphere and admire Nelson's Column.",
                  location: "Trafalgar Square",
                  category: ActivityCategory.activity,
                  order: 3,
                },
                {
                  time: "18:30",
                  title: "Dinner in Covent Garden",
                  description: "Enjoy dinner in the vibrant Covent Garden area, known for its street performers and restaurants.",
                  location: "Covent Garden",
                  category: ActivityCategory.food,
                  order: 4,
                },
                {
                  time: "20:00",
                  title: "Optional: West End Show",
                  description: "Catch a world-class theater performance in London's famous West End.",
                  location: "West End Theatres",
                  category: ActivityCategory.activity,
                  order: 5,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            date: "2026-01-03",
            title: "Tower of London and South Bank",
            activities: {
              create: [
                {
                  time: "10:00",
                  title: "Tower of London",
                  description: "Explore the historic castle, see the Crown Jewels, and learn about its fascinating history.",
                  location: "Tower of London",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "12:30",
                  title: "Lunch near Tower Bridge",
                  description: "Have lunch with views of Tower Bridge.",
                  location: "Tower Hill",
                  category: ActivityCategory.food,
                  order: 1,
                },
                {
                  time: "14:00",
                  title: "Walk across Tower Bridge",
                  description: "Experience walking across this iconic London landmark.",
                  location: "Tower Bridge",
                  category: ActivityCategory.activity,
                  order: 2,
                },
                {
                  time: "15:00",
                  title: "South Bank Exploration",
                  description: "Walk along the South Bank, enjoying views of the city skyline, street art, and independent shops.",
                  location: "South Bank",
                  category: ActivityCategory.activity,
                  order: 3,
                },
                {
                  time: "16:30",
                  title: "Tate Modern",
                  description: "Visit the iconic modern and contemporary art museum.",
                  location: "Tate Modern",
                  category: ActivityCategory.activity,
                  order: 4,
                },
                {
                  time: "18:30",
                  title: "Dinner on the South Bank",
                  description: "Enjoy dinner at one of the many restaurants along the South Bank.",
                  location: "South Bank",
                  category: ActivityCategory.food,
                  order: 5,
                },
                {
                  time: "20:00",
                  title: "London Eye (Optional)",
                  description: "Enjoy panoramic views of London from the famous observation wheel.",
                  location: "London Eye",
                  category: ActivityCategory.activity,
                  order: 6,
                },
                {
                  time: "21:30",
                  title: "Return to Hotel",
                  description: "Head back to your hotel.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.accommodation,
                  order: 7,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            date: "2026-01-04",
            title: "Royal Parks and Kensington",
            activities: {
              create: [
                {
                  time: "10:00",
                  title: "Kensington Palace",
                  description: "Explore the former home of Queen Victoria and Princess Diana.",
                  location: "Kensington Palace",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "11:30",
                  title: "Explore Kensington Gardens and Hyde Park",
                  description: "Wander through these beautiful adjacent Royal Parks.",
                  location: "Kensington Gardens & Hyde Park",
                  category: ActivityCategory.activity,
                  order: 1,
                },
                {
                  time: "13:00",
                  title: "Lunch in Kensington",
                  description: "Enjoy lunch in the charming Kensington area.",
                  location: "Kensington",
                  category: ActivityCategory.food,
                  order: 2,
                },
                {
                  time: "14:30",
                  title: "Victoria and Albert Museum",
                  description: "Discover world-class decorative arts and design.",
                  location: "Victoria and Albert Museum",
                  category: ActivityCategory.activity,
                  order: 3,
                },
                {
                  time: "17:00",
                  title: "Shopping in Knightsbridge or Kensington High Street",
                  description: "Indulge in some retail therapy at luxury department stores or local boutiques.",
                  location: "Knightsbridge/Kensington High Street",
                  category: ActivityCategory.activity,
                  order: 4,
                },
                {
                  time: "19:00",
                  title: "Farewell Dinner",
                  description: "Enjoy a special farewell dinner at a restaurant of your choice.",
                  location: "Various options",
                  category: ActivityCategory.food,
                  order: 5,
                },
                {
                  time: "21:00",
                  title: "Return to Hotel",
                  description: "Return to your hotel to pack and relax.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.accommodation,
                  order: 6,
                },
              ],
            },
          },
          {
            dayNumber: 5,
            date: "2026-01-05",
            title: "Departure",
            activities: {
              create: [
                {
                  time: "09:00",
                  title: "Leisurely Breakfast",
                  description: "Enjoy a final London breakfast.",
                  location: "Hotel or local cafe",
                  category: ActivityCategory.food,
                  order: 0,
                },
                {
                  time: "10:00",
                  title: "Last Minute Souvenir Shopping",
                  description: "Pick up any last-minute gifts or souvenirs.",
                  location: "Paddington Area",
                  category: ActivityCategory.activity,
                  order: 1,
                },
                {
                  time: "11:00",
                  title: "Check out of Hotel",
                  description: "Check out of your hotel.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.accommodation,
                  order: 2,
                },
                {
                  time: "11:30",
                  title: "Travel to Paddington Station",
                  description: "Make your way to Paddington Station.",
                  location: "Hotel near Paddington",
                  category: ActivityCategory.transport,
                  order: 3,
                },
                {
                  time: "12:00",
                  title: "Heathrow Express to Heathrow Airport (LHR)",
                  description: "Take the Heathrow Express back to the airport for your departure.",
                  location: "Paddington Station",
                  category: ActivityCategory.transport,
                  order: 4,
                },
                {
                  time: "14:00",
                  title: "Depart from London",
                  description: "Depart from London Heathrow Airport.",
                  location: "Heathrow Airport (LHR)",
                  category: ActivityCategory.transport,
                  order: 5,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_6.title);

  // Trip: Parisian Culinary Delights
  const trip_7 = await prisma.trip.upsert({
    where: { 
      id: 7 
    },
    update: {
      userId: user_1.id,
      title: "Parisian Culinary Delights",
      destination: "Paris, France",
      startDate: new Date('2024-04-10T00:00:00.000Z'),
      endDate: new Date('2024-04-14T00:00:00.000Z'),
      budget: "$90 - $400/day",
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
    },
    create: {
      userId: user_1.id,
      title: "Parisian Culinary Delights",
      destination: "Paris, France",
      startDate: new Date('2024-04-10T00:00:00.000Z'),
      endDate: new Date('2024-04-14T00:00:00.000Z'),
      budget: "$90 - $400/day",
      travelers: 1,
      status: TripStatus.SAVED,
      imageUrl: "",
      days: {
        create: [
          {
            dayNumber: 1,
            date: "2024-04-10",
            title: "Arrival and Eiffel Tower Charm",
            activities: {
              create: [
                {
                  time: "12:00",
                  title: "Arrival in Paris",
                  description: "Check into your accommodation and settle in.",
                  location: null,
                  category: ActivityCategory.accommodation,
                  order: 0,
                },
                {
                  time: "16:00",
                  title: "Eiffel Tower Visit",
                  description: "Ascend the iconic Eiffel Tower for breathtaking views of the city.",
                  location: "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
                  category: ActivityCategory.activity,
                  order: 1,
                },
                {
                  time: "18:30",
                  title: "Pre-Eiffel Tower Apéritif",
                  description: "Enjoy a classic French apéritif at a charming local bar near the Eiffel Tower.",
                  location: "Nearby Eiffel Tower",
                  category: ActivityCategory.food,
                  order: 2,
                },
                {
                  time: "19:30",
                  title: "Dinner near Eiffel Tower",
                  description: "Savor traditional French cuisine at a restaurant with views of the illuminated Eiffel Tower.",
                  location: "Near Eiffel Tower",
                  category: ActivityCategory.food,
                  order: 3,
                },
                {
                  time: "21:00",
                  title: "Evening Stroll along the Seine",
                  description: "A romantic walk along the Seine River as the city lights up.",
                  location: "Seine River Banks",
                  category: ActivityCategory.activity,
                  order: 4,
                },
              ],
            },
          },
          {
            dayNumber: 2,
            date: "2024-04-11",
            title: "Art, History, and Island Wonders",
            activities: {
              create: [
                {
                  time: "09:00",
                  title: "Louvre Museum Exploration",
                  description: "Immerse yourself in art and history at the world-renowned Louvre Museum.",
                  location: "Rue de Rivoli, 75001 Paris, France",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "12:30",
                  title: "Gourmet Picnic Lunch in Tuileries Garden",
                  description: "Enjoy a delightful picnic lunch with fresh produce and artisanal cheeses from a local market.",
                  location: "Jardin des Tuileries",
                  category: ActivityCategory.food,
                  order: 1,
                },
                {
                  time: "14:30",
                  title: "Notre-Dame Cathedral (Exterior View)",
                  description: "Admire the stunning Gothic architecture of Notre-Dame Cathedral from the outside.",
                  location: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France",
                  category: ActivityCategory.activity,
                  order: 2,
                },
                {
                  time: "16:00",
                  title: "Explore Île de la Cité and Sainte-Chapelle",
                  description: "Discover the historical heart of Paris and marvel at the stained glass of Sainte-Chapelle.",
                  location: "Île de la Cité",
                  category: ActivityCategory.activity,
                  order: 3,
                },
                {
                  time: "17:30",
                  title: "Pastry Tasting in Latin Quarter",
                  description: "Indulge in exquisite French pastries at a renowned patisserie in the Latin Quarter.",
                  location: "Latin Quarter",
                  category: ActivityCategory.food,
                  order: 4,
                },
                {
                  time: "19:30",
                  title: "Dinner in the Latin Quarter",
                  description: "Experience the vibrant atmosphere and diverse culinary scene of the Latin Quarter.",
                  location: "Latin Quarter",
                  category: ActivityCategory.food,
                  order: 5,
                },
              ],
            },
          },
          {
            dayNumber: 3,
            date: "2024-04-12",
            title: "Montmartre Charm and Artistic Vibe",
            activities: {
              create: [
                {
                  time: "10:00",
                  title: "Sacré-Cœur Basilica Visit",
                  description: "Visit the magnificent Sacré-Cœur Basilica and enjoy panoramic views.",
                  location: "35 Rue du Chevalier de la Barre, 75018 Paris, France",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "11:30",
                  title: "Wander through Montmartre",
                  description: "Explore the artistic streets, discover hidden squares, and soak in the bohemian atmosphere.",
                  location: "Montmartre",
                  category: ActivityCategory.activity,
                  order: 1,
                },
                {
                  time: "13:00",
                  title: "Crêpe Lunch in Montmartre",
                  description: "Enjoy delicious sweet or savory crêpes from a local crêperie.",
                  location: "Montmartre",
                  category: ActivityCategory.food,
                  order: 2,
                },
                {
                  time: "15:00",
                  title: "Musée d'Orsay Exploration",
                  description: "Discover Impressionist and Post-Impressionist masterpieces in a former railway station.",
                  location: "1 Rue de la Légion d'Honneur, 75007 Paris, France",
                  category: ActivityCategory.activity,
                  order: 3,
                },
                {
                  time: "17:00",
                  title: "Macaron Tasting",
                  description: "Sample a variety of delicate and flavorful macarons from a famous Parisian patisserie.",
                  location: "Saint-Germain-des-Prés",
                  category: ActivityCategory.food,
                  order: 4,
                },
                {
                  time: "19:00",
                  title: "Dinner in Saint-Germain-des-Prés",
                  description: "Dine in the elegant Saint-Germain-des-Prés district, known for its literary cafes and fine dining.",
                  location: "Saint-Germain-des-Prés",
                  category: ActivityCategory.food,
                  order: 5,
                },
              ],
            },
          },
          {
            dayNumber: 4,
            date: "2024-04-13",
            title: "Culinary Exploration and Parisian Flavors",
            activities: {
              create: [
                {
                  time: "09:30",
                  title: "Arc de Triomphe Visit",
                  description: "Climb to the top of the Arc de Triomphe for stunning views down the Champs-Élysées.",
                  location: "Place Charles de Gaulle, 75008 Paris, France",
                  category: ActivityCategory.activity,
                  order: 0,
                },
                {
                  time: "10:30",
                  title: "Stroll down the Champs-Élysées",
                  description: "Walk along the famous avenue, perhaps stopping for a coffee.",
                  location: "Avenue des Champs-Élysées",
                  category: ActivityCategory.activity,
                  order: 1,
                },
                {
                  time: "12:00",
                  title: "Le Marais Food Tour",
                  description: "Embark on a guided food tour through the historic Le Marais district, sampling local delicacies.",
                  location: "Le Marais District",
                  category: ActivityCategory.food,
                  order: 2,
                },
                {
                  time: "15:00",
                  title: "Cheese and Wine Tasting",
                  description: "Experience a curated selection of French cheeses paired with exquisite wines.",
                  location: "Specialty Wine Bar",
                  category: ActivityCategory.food,
                  order: 3,
                },
                {
                  time: "19:00",
                  title: "Farewell Parisian Dinner",
                  description: "Enjoy a memorable farewell dinner at a highly-rated restaurant.",
                  location: "Selected Restaurant",
                  category: ActivityCategory.food,
                  order: 4,
                },
              ],
            },
          },
          {
            dayNumber: 5,
            date: "2024-04-14",
            title: "Leisurely Morning and Departure",
            activities: {
              create: [
                {
                  time: "10:00",
                  title: "Visit a Local Boulangerie",
                  description: "Start your day with fresh croissants and coffee from a traditional Parisian bakery.",
                  location: "Local Boulangerie",
                  category: ActivityCategory.food,
                  order: 0,
                },
                {
                  time: "11:00",
                  title: "Last Minute Souvenir Shopping",
                  description: "Pick up some last-minute souvenirs to remember your trip.",
                  location: "Shopping Area",
                  category: ActivityCategory.activity,
                  order: 1,
                },
                {
                  time: "12:30",
                  title: "Leisurely Lunch",
                  description: "Enjoy a final relaxed lunch in Paris.",
                  location: "Cafe or Bistro",
                  category: ActivityCategory.food,
                  order: 2,
                },
                {
                  time: "14:00",
                  title: "Transfer to Airport",
                  description: "Head to the airport for your departure.",
                  location: null,
                  category: ActivityCategory.transport,
                  order: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded trip:', trip_7.title);

  // Payment Method: Card
  await prisma.paymentMethod.upsert({
    where: { id: 1 },
    update: {
      userId: user_1.id,
      label: "Card",
      last4: "3213",
      cardNumber: "",
      cardholderName: "",
      expiry: "05/20",
      cvv: "",
      isDefault: true,
    },
    create: {
      userId: user_1.id,
      label: "Card",
      last4: "3213",
      cardNumber: "",
      cardholderName: "",
      expiry: "05/20",
      cvv: "",
      isDefault: true,
    },
  });
}

export default seedLocalData;
