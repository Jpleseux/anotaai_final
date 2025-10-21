import { DataSource } from "typeorm";
import { config } from "dotenv";
import { join } from "path";
import { ListModel } from "../../modules/lists/infra/database/models/List.model";
import { ListItemModel } from "../../modules/lists/infra/database/models/ListItem.model";
import { UserModel } from "../../modules/auth/infra/database/models/User.model";
import { ItemModel } from "../../modules/itens/infra/database/models/Item.model";

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
  entities: [ListModel, ListItemModel, UserModel, ItemModel ],
  migrations: [join(process.cwd(), "/src/**/*.migration.{ts,js}")],
});

export default AppDataSource; 