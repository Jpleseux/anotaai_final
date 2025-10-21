import { Request, Response } from "express";
import { AppError } from "../../core/errors/AppError";
import { CreateItemUsecase } from "../../modules/itens/core/usecases/createItem.usecase";
import { UpdateItemUsecase } from "../../modules/itens/core/usecases/updateItem.usecase";
import { DeleteItemUsecase } from "../../modules/itens/core/usecases/deleteItem.usecase";
import { SearchItemsUsecase } from "../../modules/itens/core/usecases/searchItems.usecase";
import { PaginationParams } from "../../modules/lists/core/listRepository.interface";
import { FindItemByUuidUsecase } from "../../modules/itens/core/usecases/findItemByUuid.usecase";
import { FindItemsByListUsecase } from "../../modules/itens/core/usecases/findItemsByList.usecase";

/**
 * @openapi
 * /items:
 *   post:
 *     summary: Cria um novo item
 *     tags:
 *       - Itens
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - value
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
export class ItemController {
  constructor(
    private createItemUsecase: CreateItemUsecase,
    private updateItemUsecase: UpdateItemUsecase,
    private deleteItemUsecase: DeleteItemUsecase,
    private searchItemsUsecase: SearchItemsUsecase,
    private findItemByUuidUsecase: FindItemByUuidUsecase,
    private findItemsByListUsecase: FindItemsByListUsecase
  ) {}

  async createItem(req: Request, res: Response): Promise<Response> {
    console.log(req.body)
    try {
      const { name, description, value, listId } = req.body;
      const userId = req.user.uuid;

      if (!name || !description || !value) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      await this.createItemUsecase.execute({
        name,
        description,
        value,
        userId,
      }, listId);

      return res.status(201).json({ message: "Item criado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  /**
   * @openapi
   * /items/{uuid}:
   *   put:
   *     summary: Atualiza um item existente
   *     tags:
   *       - Itens
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uuid
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               value:
   *                 type: number
   *     responses:
   *       200:
   *         description: Item atualizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       403:
   *         description: Sem permissão
   *       404:
   *         description: Item não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async updateItem(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const { name, description, value } = req.body;
      const userId = req.user.uuid;

      if (!name && !description && !value) {
        return res.status(400).json({ error: "Nenhum campo para atualizar" });
      }

      await this.updateItemUsecase.execute({
        uuid,
        name,
        description,
        value,
        userId,
      });

      return res.json({ message: "Item atualizado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });

    }
  }

  /**
   * @openapi
   * /items/{uuid}:
   *   delete:
   *     summary: Deleta um item
   *     tags:
   *       - Itens
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uuid
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Item deletado com sucesso
   *       400:
   *         description: UUID inválido
   *       403:
   *         description: Sem permissão
   *       404:
   *         description: Item não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async deleteItem(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const userId = req.user.uuid;

      await this.deleteItemUsecase.execute( uuid );

      return res.json({ message: "Item deletado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @openapi
   * /items/search:
   *   get:
   *     summary: Busca itens pelo termo
   *     tags:
   *       - Itens
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: searchTerm
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *     responses:
   *       200:
   *         description: Lista de itens encontrados
   *       400:
   *         description: Termo de busca inválido
   *       500:
   *         description: Erro interno do servidor
   */
  async searchItems(req: Request, res: Response): Promise<Response> {
    try {
      const {  page, limit } = req.query;
      const userId = req.user.uuid;
      console.log(userId)

      const pagination: PaginationParams = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10
      };

      const items = await this.searchItemsUsecase.execute(
        userId,
        pagination
      );

      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  /**
   * @openapi
   * /items:
   *   get:
   *     summary: Lista todos os itens do usuário
   *     tags:
   *       - Itens
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de itens
   *       500:
   *         description: Erro interno do servidor
   */
  async getItems(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user.uuid;
      const items = await this.searchItemsUsecase.execute(userId, { page: 1, limit: 100 });
      return res.json({ data: items.data });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  /**
   * @openapi
   * /items/list/{listId}:
   *   get:
   *     summary: Lista itens de uma lista específica
   *     tags:
   *       - Itens
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: listId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de itens
   *       404:
   *         description: Lista não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async getItemsByList(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const userId = req.user.uuid;

      const items = await this.findItemsByListUsecase.execute(uuid, userId);
      return res.json({ data: items });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  /**
   * @openapi
   * /items/{uuid}:
   *   get:
   *     summary: Busca um item específico
   *     tags:
   *       - Itens
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: uuid
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Item encontrado
   *       404:
   *         description: Item não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  async getItem(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const userId = req.user.uuid;

      const item = await this.findItemByUuidUsecase.execute(uuid, userId);
      return res.json({ data: item });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
} 