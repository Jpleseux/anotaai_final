import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { listRoutes } from "./list.routes";
import { itemRoutes } from "./item.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/items", itemRoutes);
routes.use("/lists", listRoutes);

export { routes }; 