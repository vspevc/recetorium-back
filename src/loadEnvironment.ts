import dotenv from "dotenv";
dotenv.config();

const { PORT: port, MONGODB_URL: mongoDatabaseUrl } = process.env;

interface EnvironmentStructure {
  port: number;
  mongoDatabaseUrl: string;
}

const environment: EnvironmentStructure = {
  port: +port || 4000,
  mongoDatabaseUrl,
};

export default environment;
