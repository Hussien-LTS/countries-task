import { PrismaClient } from "@prisma/client";

// Instantiate PrismaClient
const prisma = new PrismaClient();

// Export the Prisma instance to be used throughout your application
export default prisma;
