import type CustomErrorStructure from "./types";

interface ServerCustomErrorsStructure {
  notFoundErrorMessage: (path: string) => CustomErrorStructure;
  unknownServerErrorMessage: string;
}

const serverCustomErrors: ServerCustomErrorsStructure = {
  notFoundErrorMessage: (path) => ({
    message: `Endpoint not found: ${path}`,
    publicMessage: "Endpoint not found",
    statusCode: 404,
  }),
  unknownServerErrorMessage: "Internal server error",
};

export default serverCustomErrors;
