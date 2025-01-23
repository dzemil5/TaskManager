import { PrismaClient } from '@prisma/client';
import { BcryptPasswordHasher } from '../src/utils/passwordHasher'; // Import the class

const prisma = new PrismaClient();
const passwordHasher = new BcryptPasswordHasher(); // Create an instance of the class

async function seed() {
  const plainPassword = 'yourPassword123';
  const hashedPassword = await passwordHasher.hashPassword(plainPassword);

  // Add multiple users with unique emails
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com', // Ensure this is unique
      password: hashedPassword,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com', // Ensure this is unique
      password: hashedPassword,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com', // Ensure this is unique
      password: hashedPassword,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Emily Davis',
      email: 'emily.davis@example.com', // Ensure this is unique
      password: hashedPassword,
    },
  });

  console.log('Seeding completed.');
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
