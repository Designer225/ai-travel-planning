import { PrismaClient } from '@prisma/client';
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


