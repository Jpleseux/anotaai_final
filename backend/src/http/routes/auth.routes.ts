import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { CreateUserUsecase } from "../../modules/auth/core/usecases/createUser.usecase";
import { LoginUsecase } from "../../modules/auth/core/usecases/login.usecase";
import { AuthGateway } from "../../modules/auth/infra/gateways/auth.gateway";
import { UserRepository } from "../../modules/auth/infra/database/repositories/UserRepository";
import AppDataSource from "../../infrastructure/database/config";

const authRoutes = Router();
const userRepository = new UserRepository(AppDataSource);
const createUserUsecase = new CreateUserUsecase(userRepository, new AuthGateway());
const loginUsecase = new LoginUsecase(userRepository, new AuthGateway());
const authController = new AuthController(createUserUsecase, loginUsecase);

authRoutes.post("/register", (req, res) => authController.createUser(req, res));
authRoutes.post("/login", (req, res) => authController.login(req, res));

export { authRoutes }; 