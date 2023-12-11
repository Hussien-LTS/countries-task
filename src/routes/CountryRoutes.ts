import express, { Router } from "express";
import {
  httpGetAllCountries,
  httpGetCountryCurrencies,
  httpGetSearchCountries,
  httpGetGroupCountries,
  httpGetDownloadData,
} from "../controllers/CountriesController";

const countriesRouter: Router = express.Router();

countriesRouter.get("/all", httpGetAllCountries);
countriesRouter.get("/search", httpGetSearchCountries);
countriesRouter.get("/get-currency/:cca2", httpGetCountryCurrencies);
countriesRouter.get("/group-country/:valueToGroupBy", httpGetGroupCountries);
countriesRouter.get("/download", httpGetDownloadData);
export default countriesRouter;
