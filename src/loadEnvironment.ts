import dotenv from "dotenv";
dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDatabaseUrl,
  CORS_ALLOWED_ORIGINS: corsAllowedOrigins,
} = process.env;

interface EnvironmentStructure {
  port: number;
  mongoDatabaseUrl: string;
  corsAllowedOrigins: string[];
}

const environment: EnvironmentStructure = {
  port: +port || 4000,
  mongoDatabaseUrl,
  corsAllowedOrigins: corsAllowedOrigins.split(","),
};

export default environment;
