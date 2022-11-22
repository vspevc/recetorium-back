import type CustomErrorStructure from "./types";

interface ServerCustomErrorsStructure {
  notFoundErrorMessage: (path: string) => CustomErrorStructure;
  unauthorizedCorsOrigin: (requestOrigin: string) => CustomErrorStructure;
  unknownServerErrorMessage: string;
}

const serverCustomErrors: ServerCustomErrorsStructure = {
  notFoundErrorMessage: (path) => ({
    message: `Endpoint not found: ${path}`,
    publicMessage: "Endpoint not found",
    statusCode: 404,
  }),
  unauthorizedCorsOrigin: (requestOrigin) => ({
    message: `Unauthorized cors origin: ${requestOrigin}`,
    publicMessage: "Cross-Origin Request Blocked",
    statusCode: 400,
  }),
  unknownServerErrorMessage: "Internal server error",
};

export default serverCustomErrors;
