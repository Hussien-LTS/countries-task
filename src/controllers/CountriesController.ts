import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPaginationParams = (req: Request) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
};

export const httpGetAllCountries = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, offset } = getPaginationParams(req);

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
export const httpGetSearchCountries = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (query === undefined) {
    return res.status(400).json({
      error: "Missing or undefined 'q' parameter",
      message: "The 'q' parameter is required for this endpoint.",
    });
  }

  try {
    const { page, pageSize, offset } = getPaginationParams(req);

    const countries = await prisma.country.findMany({
      where: {
        OR: [
          { name: query },
          { cca2: query },
          { cca3: query },
          { ccn3: query },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      take: pageSize,
      skip: offset,
    });
    return res
      .status(200)
      .json({ count: countries.length, page, pageSize, data: countries });
  } catch (error) {
    console.error("Error in searchCountries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
