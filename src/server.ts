// Import necessary modules
import http from "http";
import app from "./app";
import { PrismaClient } from "@prisma/client"; // Import Prisma client

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the port
const port = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle shutdown gracefully
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully");
  await prisma.$disconnect(); // Disconnect Prisma client
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully");
  await prisma.$disconnect(); // Disconnect Prisma client
  process.exit(0);
});
