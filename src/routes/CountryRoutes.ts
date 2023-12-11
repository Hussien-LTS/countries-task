import express, { Router } from "express";
import { httpGetAllCountries } from "../controllers/CountriesController";

const countriesRouter: Router = express.Router();

countriesRouter.get("/all", httpGetAllCountries);

export default countriesRouter;
