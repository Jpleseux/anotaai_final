import { DataSource } from "typeorm";
import { config } from "dotenv";
import { join } from "path";

// Load environment variables
config();

const isDocker = process.env.NODE_ENV === "production";

const AppDataSource = new DataSource({
  type: "postgres",
  host: isDocker ? "backend-db" : "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "anotaai",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [join(process.cwd(), "/src/**/*.model.{ts,js}")],
  migrations: [join(process.cwd(), "/src/**/*.migration.{ts,js}")],
});

export default AppDataSource; 