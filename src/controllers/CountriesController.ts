import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const httpGetAllCountries = async (req: Request, res: Response) => {
  try {
    // Extract page and pageSize from query parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

    // Calculate the offset based on the page and pageSize
    const offset = (page - 1) * pageSize;

    // Query the database with pagination
    const countries = await prisma.country.findMany({
      take: pageSize,
      skip: offset,
    });

    return res.status(200).json({
      count: countries.length,
      page,
      pageSize,
      data: countries,
    });
  } catch (error) {
    console.error("Error in getAllCountries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
