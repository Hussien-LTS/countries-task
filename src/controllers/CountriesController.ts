import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GroupByType } from "../utlis/interfaces";

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

    if (!fs.existsSync("countryData")) {
      fs.mkdirSync("countryData");
    }

    fs.writeFileSync(
      "countryData/AllCountries.json",
      JSON.stringify(
        { count: countries.length, page, pageSize, data: countries },
        null,
        2
      ),
      "utf-8"
    );
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
          { common_name: query },
          { official_name: query },
          { cca2: query },
          { cca3: query },
          { ccn3: query },
          { official_name: { contains: query, mode: "insensitive" } },
        ],
      },
      take: pageSize,
      skip: offset,
    });

    if (!fs.existsSync("countryData")) {
      fs.mkdirSync("countryData");
    }

    fs.writeFileSync(
      "countryData/SearchedCountries.json",
      JSON.stringify(
        { count: countries.length, page, pageSize, data: countries },
        null,
        2
      ),
      "utf-8"
    );

    return res
      .status(200)
      .json({ count: countries.length, page, pageSize, data: countries });
  } catch (error) {
    console.error("Error in searchCountries:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const httpGetCountryCurrencies = async (req: Request, res: Response) => {
  try {
    const cca2 = req.params.cca2 as string;
    const country = await prisma.country.findUnique({
      where: {
        cca2,
      },
      select: {
        currencies: true,
      },
    });
    if (country) {
      if (!fs.existsSync("countryData")) {
        fs.mkdirSync("countryData");
      }

      fs.writeFileSync(
        "countryData/CountryCurrencies.json",
        JSON.stringify(country, null, 2),
        "utf-8"
      );
      return res.status(200).json({ data: country.currencies });
    } else {
      return res.status(404).json({ error: "Country not found" });
    }
  } catch (error) {
    console.error("Error in getCountryCurrencies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const httpGetGroupCountries = async (req: Request, res: Response) => {
  try {
    const valueToGroupBy = req.params.valueToGroupBy as GroupByType;
    if (valueToGroupBy !== "languages" && valueToGroupBy !== "region") {
      return res.status(400).json({
        error: "Invalid 'valueToGroupBy' parameter",
        message:
          "The 'valueToGroupBy' parameter must be either 'languages' or 'region'.",
      });
    }
    const groupedCountries = await prisma.country.groupBy({
      by: [`${valueToGroupBy}`],
      _count: {
        id: true,
      },
    });
    if (!fs.existsSync("countryData")) {
      fs.mkdirSync("countryData");
    }

    fs.writeFileSync(
      "countryData/groupedCountries.json",
      JSON.stringify(
        { count: groupedCountries.length, data: groupedCountries },
        null,
        2
      ),
      "utf-8"
    );
    return res
      .status(200)
      .json({ count: groupedCountries.length, data: groupedCountries });
  } catch (error) {
    console.error("Error in groupCountriesByRegion:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const httpGetDownloadData = async (req: Request, res: Response) => {
  const isAdmin = req.headers["x-admin"] === "1";

  if (isAdmin) {
    const directoryPath = path.join(process.cwd(), "countryData");

    if (!directoryPath) {
      return res.status(404).send("No directory found ");
    }

    try {
      const zipFileName = "downloaded-folder.zip";
      const zipFilePath = path.join(__dirname, zipFileName);

      const output = fs.createWriteStream(zipFilePath);
      const archive = require("archiver")("zip");

      output.on("close", () => {
        res.download(zipFilePath, zipFileName, () => {
          fs.unlinkSync(zipFilePath);
        });
      });

      archive.pipe(output);
      archive.directory(directoryPath, false);
      archive.finalize();
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    return res
      .status(403)
      .json({ error: "Access Forbidden: Only admins can download the file." });
  }
};
