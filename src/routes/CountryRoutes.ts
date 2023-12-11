import express, { Router } from "express";
import {
  httpGetAllCountries,
  getCountryCurrencies,
  httpGetSearchCountries,
} from "../controllers/CountriesController";

const countriesRouter: Router = express.Router();

countriesRouter.get("/all", httpGetAllCountries);
countriesRouter.get("/search", httpGetSearchCountries);
countriesRouter.get("/get-currency/:cca2", getCountryCurrencies);
export default countriesRouter;
