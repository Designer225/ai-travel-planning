import { PrismaClient, TripStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'john.smith@gmail.com';
  const password = 'password123';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName: 'John',
      lastName: 'Smith',
      bio: 'Travel Enthusiast',
      location: 'San Francisco, CA',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    create: {
      email,
      passwordHash,
      firstName: 'John',
      lastName: 'Smith',
      bio: 'Travel Enthusiast',
      location: 'San Francisco, CA',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
  });

  console.log('Seeded demo user:', user.email);

  // Ensure John Smith has our three demo trips (create if missing by title)
  const demoTrips = [
    {
      title: 'Tokyo Spring Adventure',
      destination: 'Tokyo, Japan',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-07'),
      budget: '$2,000 - $2,500',
      travelers: 2,
      status: TripStatus.UPCOMING,
      imageUrl:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop',
    },
    {
      title: 'Romantic Paris Getaway',
      destination: 'Paris, France',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-17'),
      budget: '$1,500 - $2,000',
      travelers: 2,
      status: TripStatus.PAST,
      imageUrl:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop',
    },
    {
      title: 'Bali Dream Escape',
      destination: 'Bali, Indonesia',
      startDate: null,
      endDate: null,
      budget: '$1,800 - $2,200',
      travelers: 2,
      status: TripStatus.SAVED,
      imageUrl:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop',
    },
  ];

  for (const trip of demoTrips) {
    const existing = await prisma.trip.findFirst({
      where: {
        userId: user.id,
        title: trip.title,
      },
    });

    if (!existing) {
      await prisma.trip.create({
        data: {
          userId: user.id,
          ...trip,
        },
      });
    }
  }

  console.log('Ensured demo trips exist for user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




