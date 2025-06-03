import { DataSource } from "typeorm";
import { ListRepositoryInterface, PaginationParams, PaginatedResponse } from "../../core/listRepository.interface";
import { ListEntity } from "../../core/entities/List.entity";
import { ListModel } from "../database/models/List.model";
import { ListItemModel } from "../database/models/ListItem.model";
import { ItemEntity } from "../../../../modules/itens/core/entities/item.entity";

export class ListRepository implements ListRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {}

  async saveList(list: ListEntity): Promise<void> {
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
  }

  async updateList(list: ListEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(ListModel)
      .set({
        name: list.name,
        description: list.description,
      })
      .where("uuid = :uuid", { uuid: list.uuid })
      .execute();
  }

  async deleteList(uuid: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .softDelete()
      .from(ListModel)
      .where("uuid = :uuid", { uuid })
      .execute();
  }

  async findListByUuid(uuid: string): Promise<ListEntity> {
    const listDb = await this.dataSource
      .getRepository(ListModel)
      .createQueryBuilder("list")
      .where("list.uuid = :uuid", { uuid })
      .getOne();

    if (!listDb) {
      return null;
    }

    const items = await this.dataSource
      .getRepository(ListItemModel)
      .createQueryBuilder("list_item")
      .innerJoinAndSelect("items", "item", "item.uuid = list_item.item_id")
      .where("list_item.list_id = :listId", { listId: uuid })
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
      uuid: listDb.uuid,
      name: listDb.name,
      description: listDb.description,
      userId: listDb.user_id,
      items: itemEntities,
      createdAt: listDb.created_at,
      updatedAt: listDb.updated_at,
      deletedAt: listDb.deleted_at,
    });
  }

  async findAllListsByUserId(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<ListEntity>> {
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
  }

  async addItemToList(listUuid: string, itemUuid: string): Promise<void> {
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
  }

  async removeItemFromList(listUuid: string, itemUuid: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(ListItemModel)
      .where("list_id = :listId AND item_id = :itemId", {
        listId: listUuid,
        itemId: itemUuid,
      })
      .execute();
  }
} 