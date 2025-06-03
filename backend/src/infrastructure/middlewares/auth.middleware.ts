import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/errors/AppError";
import { AuthGateway } from "../../modules/auth/infra/gateways/auth.gateway";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido");
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      throw new AppError("Token não fornecido");
    }

    const authGateway = new AuthGateway();
    const decoded = await authGateway.tokenDecoding(token);

    req.user = {
      uuid: decoded.uuid,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(401).json({
      message: "Token inválido",
    });
  }
}; 