import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const instance = axios.create({
  timeout: 20000,
});
async function seedDatabase() {
  try {
    // Fetch data from the REST Countries API
    const response = await instance.get("https://restcountries.com/v3.1/all");
    const countries = response.data;

    for (const country of countries) {
      await prisma.country.create({
        data: {
          name: country?.name?.common || country?.name?.official,
          languages: country.languages || "no value found",
          cca2: country.cca2 || "no value found",
          cca3: country.cca3 || "no value found",
          ccn3: country.ccn3 || "no value found",
          currencies: country?.currencies || "no value found",
          region: country.region || "no value found",
          latlng: country.latlng || "no value found",
        },
      });
    }

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
