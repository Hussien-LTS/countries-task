import { Request, Response } from "express";
import axios from "axios";

const baseURL = "https://restcountries.com/v3.1";

async function httpGetAllCountries(req: Request, res: Response) {
  try {
    const result = await axios.get(`${baseURL}/all`);
    console.log(result.data);
    const x = result.data[0];
    return res.status(200).json({ x });
  } catch (error) {
    return res.status(404).json({
      error: error,
      statusCode: 404,
    });
  }
}

export { httpGetAllCountries };
