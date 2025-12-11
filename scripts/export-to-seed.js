/**
 * Export local database data to seed-friendly format
 * This creates a TypeScript file that can be added to prisma/seed.ts
 * 
 * Run: node scripts/export-to-seed.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportToSeed() {
  try {
    console.log('📤 Exporting data to seed format...\n');

    // Get all users
    const users = await prisma.user.findMany({
      include: {
        trips: {
          include: {
            days: {
              include: {
                activities: true,
              },
            },
          },
        },
        paymentMethods: true,
      },
    });

    if (users.length === 0) {
      console.log('⚠️  No users found in local database.');
      await prisma.$disconnect();
      return;
    }

    // Generate seed data code
    let seedCode = `// Auto-generated seed data from local database
// Add this to your prisma/seed.ts file

import { PrismaClient, TripStatus, ActivityCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedLocalData() {
`;

    for (const user of users) {
      const passwordHash = user.passwordHash; // Keep existing hash
      
      seedCode += `
  // User: ${user.email}
  const user_${user.id} = await prisma.user.upsert({
    where: { email: '${user.email}' },
    update: {
      passwordHash: '${passwordHash}',
      firstName: '${user.firstName}',
      lastName: '${user.lastName}',
      bio: ${JSON.stringify(user.bio)},
      location: ${JSON.stringify(user.location)},
      avatarUrl: ${JSON.stringify(user.avatarUrl)},
    },
    create: {
      email: '${user.email}',
      passwordHash: '${passwordHash}',
      firstName: '${user.firstName}',
      lastName: '${user.lastName}',
      bio: ${JSON.stringify(user.bio)},
      location: ${JSON.stringify(user.location)},
      avatarUrl: ${JSON.stringify(user.avatarUrl)},
    },
  });

  console.log('Seeded user:', user_${user.id}.email);
`;

      // Add trips for this user
      for (const trip of user.trips) {
        seedCode += `
  // Trip: ${trip.title}
  const trip_${trip.id} = await prisma.trip.upsert({
    where: { 
      id: ${trip.id} 
    },
    update: {
      userId: user_${user.id}.id,
      title: ${JSON.stringify(trip.title)},
      destination: ${JSON.stringify(trip.destination)},
      startDate: ${trip.startDate ? `new Date('${trip.startDate.toISOString()}')` : 'null'},
      endDate: ${trip.endDate ? `new Date('${trip.endDate.toISOString()}')` : 'null'},
      budget: ${trip.budget ? JSON.stringify(trip.budget) : 'null'},
      travelers: ${trip.travelers || 'null'},
      status: TripStatus.${trip.status},
      imageUrl: ${JSON.stringify(trip.imageUrl || '')},
    },
    create: {
      userId: user_${user.id}.id,
      title: ${JSON.stringify(trip.title)},
      destination: ${JSON.stringify(trip.destination)},
      startDate: ${trip.startDate ? `new Date('${trip.startDate.toISOString()}')` : 'null'},
      endDate: ${trip.endDate ? `new Date('${trip.endDate.toISOString()}')` : 'null'},
      budget: ${trip.budget ? JSON.stringify(trip.budget) : 'null'},
      travelers: ${trip.travelers || 'null'},
      status: TripStatus.${trip.status},
      imageUrl: ${JSON.stringify(trip.imageUrl || '')},
      days: {
        create: [
`;

        // Add days and activities
        for (const day of trip.days) {
          seedCode += `          {
            dayNumber: ${day.dayNumber},
            date: ${day.date ? JSON.stringify(day.date) : 'null'},
            title: ${JSON.stringify(day.title)},
            activities: {
              create: [
`;
          for (const activity of day.activities) {
            seedCode += `                {
                  time: ${JSON.stringify(activity.time)},
                  title: ${JSON.stringify(activity.title)},
                  description: ${JSON.stringify(activity.description)},
                  location: ${activity.location ? JSON.stringify(activity.location) : 'null'},
                  category: ActivityCategory.${activity.category},
                  order: ${activity.order || 0},
                },
`;
          }
          seedCode += `              ],
            },
          },
`;
        }

        seedCode += `        ],
      },
    },
  });

  console.log('Seeded trip:', trip_${trip.id}.title);
`;
      }

      // Add payment methods
      for (const pm of user.paymentMethods) {
        seedCode += `
  // Payment Method: ${pm.label}
  await prisma.paymentMethod.upsert({
    where: { id: ${pm.id} },
    update: {
      userId: user_${user.id}.id,
      label: ${JSON.stringify(pm.label)},
      last4: ${JSON.stringify(pm.last4)},
      cardNumber: ${JSON.stringify(pm.cardNumber || '')},
      cardholderName: ${JSON.stringify(pm.cardholderName || '')},
      expiry: ${JSON.stringify(pm.expiry)},
      cvv: ${JSON.stringify(pm.cvv || '')},
      isDefault: ${pm.isDefault},
    },
    create: {
      userId: user_${user.id}.id,
      label: ${JSON.stringify(pm.label)},
      last4: ${JSON.stringify(pm.last4)},
      cardNumber: ${JSON.stringify(pm.cardNumber || '')},
      cardholderName: ${JSON.stringify(pm.cardholderName || '')},
      expiry: ${JSON.stringify(pm.expiry)},
      cvv: ${JSON.stringify(pm.cvv || '')},
      isDefault: ${pm.isDefault},
    },
  });
`;
      }
    }

    seedCode += `}

export default seedLocalData;
`;

    // Save to file
    const outputPath = path.join(__dirname, '../prisma/seed-data.ts');
    fs.writeFileSync(outputPath, seedCode);

    console.log(`✅ Exported seed data to: ${outputPath}`);
    console.log('\n📝 Next steps:');
    console.log('1. Review the generated file: prisma/seed-data.ts');
    console.log('2. Add the seedLocalData() function to your prisma/seed.ts');
    console.log('3. Call it from main(): await seedLocalData();');
    console.log('4. Commit and push the updated seed.ts');
    console.log('5. Your teammate runs: npx prisma db seed');
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportToSeed();

