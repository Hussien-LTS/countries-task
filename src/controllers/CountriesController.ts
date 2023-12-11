import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import child_process from "child_process";
import path from "path";
const prisma = new PrismaClient();
type GroupByType = "languages" | "region";
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

async function getFilesRecursively(directoryPath: string): Promise<string[]> {
  const files: string[] = [];

  const readDirectory = async (currentPath: string) => {
    const entries = await fs.promises.readdir(currentPath);

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry);
      const stats = await fs.promises.stat(entryPath);

      if (stats.isDirectory()) {
        await readDirectory(entryPath);
      } else {
        files.push(entryPath);
      }
    }
  };

  await readDirectory(directoryPath);
  return files;
}

export const httpGetDownloadData = async (req: Request, res: Response) => {
  const isAdmin = req.headers["x-admin"] === "1";

  if (isAdmin) {
    // Construct the file path to the directory from the root of the application
    const directoryPath = path.join(process.cwd(), "countryData");
    if (!directoryPath) {
      return res.status(404).send("No directory found ");
    }

    try {
      // Get a list of all files in the directory
      // const files = await getFilesRecursively(directoryPath);
      // console.log("length", typeof files);

      // if (files.length === 0) {
      //   return res.status(404).send("No files found in the directory");
      // }

      // res.setHeader(
      //   "Content-disposition",
      //   "attachment; filename=countryData.zip"
      // );
      // res.setHeader("Content-type", "application/zip");

      // // Use async function to pipe files asynchronously
      // const streamFiles = async () => {
      //   console.log("in stream");
      //   for (const file of files) {
      //     console.log("in stream file", file);
      //     const fileStream = fs.createReadStream(file);

      //     // Use once to handle the 'end' event only once
      //     await new Promise((resolve) => fileStream.once("end", resolve));

      //     // Pipe the fileStream to the response
      //     fileStream.pipe(res, { end: false });

      //     console.log("in stream after");
      //   }

      //   // End the response after all files are streamed
      //   return res.end();
      // };
      // console.log("after stream");

      // // Call the async function to start streaming files
      // return await streamFiles();

      child_process.execSync(`zip -r archive *`, {
        cwd: "countryData",
      });

      // zip archive of your folder is ready to download
      return res.download("countryData" + "/archive.zip");
    } catch (error) {
      console.error("Error reading directory:", error);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    // If the user is not an admin, return a forbidden status
    return res
      .status(403)
      .json({ error: "Access Forbidden: Only admins can download the file." });
  }
};
