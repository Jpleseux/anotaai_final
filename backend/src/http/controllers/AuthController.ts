import { Request, Response } from "express";
import { CreateUserUsecase } from "../../modules/auth/core/usecases/createUser.usecase";
import { LoginUsecase } from "../../modules/auth/core/usecases/login.usecase";

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *       500:
 *         description: Erro interno do servidor
 */
export class AuthController {
  constructor(
    private createUserUsecase: CreateUserUsecase,
    private loginUsecase: LoginUsecase
  ) {}

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      await this.createUserUsecase.execute({ name, email, password });

      return res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Realiza login do usuário
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                 token:
   *                   type: string
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Senha incorreta
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const result = await this.loginUsecase.execute({ email, password });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
} 