import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { Country } from "../Interfaces";

const prisma = new PrismaClient();
async function seedDatabase() {
  try {
    // Fetch data from the REST Countries API
    const response = await axios.get<Country[]>(
      "https://restcountries.com/v3.1/all"
    );
    const countries = response.data;

    // Seed the database with the fetched data
    for (const country of countries) {
      await prisma.country.create({
        data: {
          name: country.name,
          languages: country.languages,
          cca2: country.cca2,
          cca3: country.cca3,
          ccn3: country.ccn3,
          currencies: country?.currencies,
          region: country.region,
          latlng: country.latlng,

          // Add other fields based on your Prisma schema
        },
      });
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    // Disconnect the Prisma client
    await prisma.$disconnect();
  }
}

seedDatabase();
