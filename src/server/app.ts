import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middleware/errors/errors.js";

const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Recetorium API" });
});

app.use(errorHandler);

export default app;
