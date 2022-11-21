import dotenv from "dotenv";
dotenv.config();

const { PORT: port } = process.env;

interface EnvironmentStructure {
  port: number;
}

const environment: EnvironmentStructure = {
  port: +port || 4000,
};

export default environment;
