import express, { Router } from "express";
import {
  httpGetAllCountries,
  httpGetSearchCountries,
} from "../controllers/CountriesController";

const countriesRouter: Router = express.Router();

countriesRouter.get("/all", httpGetAllCountries);
countriesRouter.get("/search", httpGetSearchCountries);
export default countriesRouter;
