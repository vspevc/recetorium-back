import environment from "./loadEnvironment.js";
import chalk from "chalk";
import debugCreator from "debug";
import startServer from "./server/startServer.js";
import app from "./server/app.js";

const debug = debugCreator("recetorium:root");

const { port } = environment;

try {
  await startServer(app, port);
  debug(chalk.green.bold(`Server listenig at http://localhost:${port}`));
} catch (error: unknown) {
  debug(chalk.red.bold("Error starting the API: ", (error as Error).message));
}
