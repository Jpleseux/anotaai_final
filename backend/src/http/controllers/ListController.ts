import { Request, Response } from "express";
import { AppError } from "../../core/errors/AppError";
import { CreateListUsecase } from "../../modules/lists/core/usecases/createList.usecase";
import { UpdateListUsecase } from "../../modules/lists/core/usecases/updateList.usecase";
import { DeleteListUsecase } from "../../modules/lists/core/usecases/deleteList.usecase";
import { ListUserListsUsecase } from "../../modules/lists/core/usecases/listUserLists.usecase";
import { AddItemToListUsecase } from "../../modules/lists/core/usecases/addItemToList.usecase";
import {FindListByUuidUsecase} from "../../modules/lists/core/usecases/listUserListByUuidUsecase"
/**
 * @openapi
 * /lists:
 *   post:
 *     summary: Cria uma nova lista
 *     tags:
 *       - Listas
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
export class ListController {
  constructor(
    private createListUsecase: CreateListUsecase,
    private updateListUsecase: UpdateListUsecase,
    private deleteListUsecase: DeleteListUsecase,
    private listUserListsUsecase: ListUserListsUsecase,
    private addItemToListUsecase: AddItemToListUsecase,
    private findListByUuidUsecase: FindListByUuidUsecase
  ) {}

  async createList(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description } = req.body;
      const userId = req.user.uuid;

      if (!name) {
        return res.status(400).json({ error: "O nome da lista é obrigatório" });
      }

      await this.createListUsecase.execute({
        name,
        description,
        userId,
      });

      return res.status(201).json({ message: "Lista criada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  /**
   * @openapi
   * /lists/{uuid}:
   *   put:
   *     summary: Atualiza uma lista existente
   *     tags:
   *       - Listas
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
   *     responses:
   *       200:
   *         description: Lista atualizada com sucesso
   *       400:
   *         description: Dados inválidos
   *       403:
   *         description: Sem permissão
   *       404:
   *         description: Lista não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async updateList(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const { name, description } = req.body;
      const userId = req.user.uuid;

      if (!name && !description) {
        return res.status(400).json({ error: "Nenhum campo para atualizar" });
      }

      await this.updateListUsecase.execute({
        uuid,
        name,
        description,
        userId,
      });

      return res.json({ message: "Lista atualizada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @openapi
   * /lists/{uuid}:
   *   delete:
   *     summary: Deleta uma lista
   *     tags:
   *       - Listas
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
   *         description: Lista deletada com sucesso
   *       400:
   *         description: UUID inválido
   *       403:
   *         description: Sem permissão
   *       404:
   *         description: Lista não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async deleteList(req: Request, res: Response): Promise<Response> {
    try {
      const { uuid } = req.params;
      const userId = req.user.uuid;

      await this.deleteListUsecase.execute(uuid, userId);

      return res.json({ message: "Lista deletada com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @openapi
   * /lists:
   *   get:
   *     summary: Lista todas as listas do usuário
   *     tags:
   *       - Listas
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Listas do usuário
   *       500:
   *         description: Erro interno do servidor
   */
  async listUserLists(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user.uuid;

      const lists = await this.listUserListsUsecase.execute(userId);

      return res.json(lists);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
    async listUserListByUuid(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.uuid;

      const lists = await this.findListByUuidUsecase.execute(userId);

      return res.json(lists);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * @openapi
   * /lists/{uuid}/items:
   *   post:
   *     summary: Adiciona um item a uma lista
   *     tags:
   *       - Listas
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
   *             required:
   *               - itemUuid
   *             properties:
   *               itemUuid:
   *                 type: string
   *     responses:
   *       200:
   *         description: Item adicionado à lista com sucesso
   *       400:
   *         description: Dados inválidos ou item já está na lista
   *       403:
   *         description: Sem permissão
   *       404:
   *         description: Lista não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  async addItemToList(req: Request, res: Response): Promise<Response> {
    try {
      const { listUuid, itemUuid } = req.body;
      const userId = req.user.uuid;

      if (!listUuid || !itemUuid) {
        return res.status(400).json({ error: "UUID da lista e do item são obrigatórios" });
      }

      await this.addItemToListUsecase.execute(
        listUuid,
        itemUuid,
        userId,
      );

      return res.json({ message: "Item adicionado à lista com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
} 