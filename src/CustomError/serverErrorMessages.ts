import type CustomErrorStructure from "./types";

const serverCustomErrors = {
  notFoundError: (path: string): CustomErrorStructure => ({
    message: `Endpoint not found: ${path}`,
    publicMessage: "Endpoint not found",
    statusCode: 404,
  }),
};

export default serverCustomErrors;
