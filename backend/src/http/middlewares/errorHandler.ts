import { Request, Response, NextFunction } from "express";
import { AppError } from "../../core/errors/AppError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
}; 
