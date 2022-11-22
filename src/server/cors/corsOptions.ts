import environment from "../../loadEnvironment.js";
import type { CorsOptions } from "cors";
import CustomError from "../../CustomError/CustomError.js";
import serverCustomErrors from "../../CustomError/serverErrorMessages.js";

const { corsAllowedOrigins } = environment;
const { unauthorizedCorsOrigin } = serverCustomErrors;

const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin || corsAllowedOrigins.includes(requestOrigin)) {
      callback(null, requestOrigin);
      return;
    }

    const { message, publicMessage, statusCode } =
      unauthorizedCorsOrigin(requestOrigin);

    callback(
      new CustomError(message, publicMessage, statusCode),
      requestOrigin
    );
  },
};

export default corsOptions;
