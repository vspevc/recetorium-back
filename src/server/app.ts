import express from "express";
import morgan from "morgan";

const app = express();
app.disable("x-powered-by");

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Recetorium API" });
});

export default app;
