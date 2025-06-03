import "reflect-metadata";
import { app } from "./app";
import AppDataSource from "./infrastructure/database/config";

// Inicializa o TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection initialized");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 