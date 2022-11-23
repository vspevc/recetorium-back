import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFoundError } from "./middleware/errors/errors.js";
import corsOptions from "./cors/corsOptions.js";
import routes from "./routers/routes.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";

const { users } = routes;
const app = express();

app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Recetorium API" });
});

app.use(users, usersRouter);

app.use(notFoundError);
app.use(errorHandler);

export default app;
