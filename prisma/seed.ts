import { PrismaClient, TripStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import seedLocalData from './seed-data'; // generated export of your local demo data

const prisma = new PrismaClient();

async function main() {
  // Keep or remove legacy demo data as needed; now load exported local demo data
  await seedLocalData();
  console.log('Seeded local demo data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });




