import dotenv from "dotenv";
dotenv.config();

const {
  PORT: port,
  MONGODB_URL: mongoDatabaseUrl,
  CORS_ALLOWED_ORIGINS: corsAllowedOrigins,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_RECIPE_IMAGES_BUCKET: supabaseRecipesBucket,
} = process.env;

interface EnvironmentStructure {
  port: number;
  mongoDatabaseUrl: string;
  corsAllowedOrigins: string[];
  supabaseUrl: string;
  supabaseKey: string;
  supabaseRecipesBucket: string;
}

const environment: EnvironmentStructure = {
  port: +port || 4000,
  mongoDatabaseUrl,
  corsAllowedOrigins: corsAllowedOrigins?.split(","),
  supabaseUrl,
  supabaseKey,
  supabaseRecipesBucket,
};

export default environment;
