import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const countries = response.data;

    for (const country of countries) {
      const res = await prisma.country.create({
        data: {
          name: country?.name?.common || country?.name?.official || "Unknown",
          languages: Object.keys(country.languages || {}),
          cca2: country.cca2 || "",
          cca3: country.cca3 === 0 ? "" : country.cca3 || "",
          ccn3: country.ccn3
            ? typeof country.ccn3 === "string"
              ? parseInt(country.ccn3, 10)
              : country.ccn3
            : 0,
          currencies: Object.keys(country?.currencies || {}),
          region: country.region || "",
          latlng: country.latlng || [0, 0],
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
