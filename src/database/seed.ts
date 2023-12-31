import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const countryRowCount = await prisma.country.count();
    if (countryRowCount > 0) {
      await prisma.$executeRaw`DELETE FROM "Country" CASCADE`;
    }
  } catch (error) {
    console.error("Error during drop Table seeding:", error);
    return;
  }
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const countries = response.data;

    const countriesData = countries.map((country: any) => ({
      common_name: country?.name?.common || "",
      official_name: country?.name?.official || "",
      languages: Object.keys(country.languages || {}),
      cca2: country.cca2 || "",
      cca3: country.cca3 === 0 ? "" : country.cca3 || "",
      ccn3: country.ccn3
        ? typeof country.ccn3 === "string"
          ? country.ccn3
          : country.ccn3.toString()
        : "0",
      currencies: Object.keys(country?.currencies || {}),
      region: country.region || "",
      latlng: country.latlng || [0, 0],
    }));

    const res = await prisma.country.createMany({
      data: countriesData,
    });

    console.log("Database seeding completed", res);
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
