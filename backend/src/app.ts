import express from "express";
import cors from "cors";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { routes } from "./http/routes";
import { errorHandler } from "./http/middlewares/errorHandler";
import { AppError } from "./core/errors/AppError";

const app = express();

// CORS configuration
app.use(cors({
  origin: "http://localhost:8081"
}));


// Performance configurations
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// OpenAPI Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Application routes
app.use(routes);

// Middleware for not found routes
app.use((req, res, next) => {
  throw new AppError("Rota não encontrada", 404);
});

// Error handling middleware
app.use(errorHandler);

export { app }; 