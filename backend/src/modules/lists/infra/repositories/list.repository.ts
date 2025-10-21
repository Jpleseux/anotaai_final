import { DataSource } from "typeorm";
import { ListRepositoryInterface, PaginationParams, PaginatedResponse } from "../../core/listRepository.interface";
import { ListEntity } from "../../core/entities/List.entity";
import { ListModel } from "../database/models/List.model";
import { ListItemModel } from "../database/models/ListItem.model";
import { ItemEntity } from "../../../../modules/itens/core/entities/item.entity";
import { AppError } from "../../../../core/errors/AppError";

export class ListRepository implements ListRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {}

  async saveList(list: ListEntity): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(ListModel)
        .values([
          {
            uuid: list.uuid,
            name: list.name,
            description: list.description,
            user_id: list.userId,
          },
        ])
        .execute();

      if (list.items.length > 0) {
        await this.dataSource
          .createQueryBuilder()
          .insert()
          .into(ListItemModel)
          .values(
            list.items.map((item) => ({
              list_id: list.uuid,
              item_id: item.uuid,
            }))
          )
          .execute();
      }
    } catch (error) {
      console.error("Error in saveList:", error);
      throw new AppError("Erro ao salvar lista", 500);
    }
  }

  async updateList(list: ListEntity): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(ListModel)
        .set({
          name: list.name,
          description: list.description,
        })
        .where("uuid = :uuid", { uuid: list.uuid })
        .execute();
    } catch (error) {
      console.error("Error in updateList:", error);
      throw new AppError("Erro ao atualizar lista", 500);
    }
  }

  async deleteList(uuid: string): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .softDelete()
        .from(ListModel)
        .where("uuid = :uuid", { uuid })
        .execute();
    } catch (error) {
      console.error("Error in deleteList:", error);
      throw new AppError("Erro ao deletar lista", 500);
    }
  }

  async findListByUuid(uuid: string): Promise<ListEntity> {
    try {
      console.log("Searching for list with UUID:", uuid);
      
      const listDb = await this.dataSource
        .getRepository(ListModel)
        .createQueryBuilder("list")
        .where("list.uuid = :uuid", { uuid })
        .getOne();

      console.log("Found list in database:", listDb);

      if (!listDb) {
        console.log("List not found in database");
        return null;
      }

      const items = await this.dataSource
        .getRepository(ListItemModel)
        .createQueryBuilder("list_item")
        .innerJoinAndSelect("items", "item", "item.uuid = list_item.item_id")
        .where("list_item.list_id = :listId", { listId: uuid })
        .getMany();

      console.log("Found items for list:", items);

      const itemEntities = items.map(
        (item) =>
          new ItemEntity({
            uuid: item.item_id,
            name: item.item.name,
            description: item.item.description,
            value: item.item.value,
            userId: item.item.user_id,
          })
      );

      const listEntity = new ListEntity({
        uuid: listDb.uuid,
        name: listDb.name,
        description: listDb.description,
        userId: listDb.user_id,
        items: itemEntities,
        createdAt: listDb.created_at,
        updatedAt: listDb.updated_at,
        deletedAt: listDb.deleted_at,
      });

      console.log("Created list entity:", listEntity);
      return listEntity;
    } catch (error) {
      console.error("Error in findListByUuid:", error);
      throw new AppError("Erro ao buscar lista", 500);
    }
  }

  async findAllListsByUserId(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<ListEntity>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const skip = (page - 1) * limit;

      const [listsDb, total] = await this.dataSource
        .getRepository(ListModel)
        .createQueryBuilder("list")
        .where("list.user_id = :userId", { userId })
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const lists = await Promise.all(
        listsDb.map(async (list) => {
          const items = await this.dataSource
            .getRepository(ListItemModel)
            .createQueryBuilder("list_item")
            .innerJoinAndSelect("items", "item", "item.uuid = list_item.item_id")
            .where("list_item.list_id = :listId", { listId: list.uuid })
            .getMany();

          const itemEntities = items.map(
            (item) =>
              new ItemEntity({
                uuid: item.item_id,
                name: item.item.name,
                description: item.item.description,
                value: item.item.value,
                userId: item.item.user_id,
              })
          );

          return new ListEntity({
            uuid: list.uuid,
            name: list.name,
            description: list.description,
            userId: list.user_id,
            items: itemEntities,
            createdAt: list.created_at,
            updatedAt: list.updated_at,
            deletedAt: list.deleted_at,
          });
        })
      );

      return {
        data: lists,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error("Error in findAllListsByUserId:", error);
      throw new AppError("Erro ao buscar listas", 500);
    }
  }

  async addItemToList(listUuid: string, itemUuid: string): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(ListItemModel)
        .values([
          {
            list_id: listUuid,
            item_id: itemUuid,
          },
        ])
        .execute();
    } catch (error) {
      console.error("Error in addItemToList:", error);
      throw new AppError("Erro ao adicionar item à lista", 500);
    }
  }

  async removeItemFromList(listUuid: string, itemUuid: string): Promise<void> {
    try {
      await this.dataSource
        .createQueryBuilder()
        .delete()
        .from(ListItemModel)
        .where("list_id = :listId AND item_id = :itemId", {
          listId: listUuid,
          itemId: itemUuid,
        })
        .execute();
    } catch (error) {
      console.error("Error in removeItemFromList:", error);
      throw new AppError("Erro ao remover item da lista", 500);
    }
  }
} 