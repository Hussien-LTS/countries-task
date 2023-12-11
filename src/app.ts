import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import countriesRouter from "./routes/CountryRoutes";
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/countries", countriesRouter);

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

export default app;
