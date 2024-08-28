import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv"; 

dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    url:String(process.env.DB_URL),
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: "defaultdb",
    ssl: {
      rejectUnauthorized: false,
      ca:process.env.DB_CA
    },
  },
});
