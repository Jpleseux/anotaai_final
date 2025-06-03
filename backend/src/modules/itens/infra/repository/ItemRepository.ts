import { DataSource } from "typeorm";
import { ItemRepositoryInterface } from "../../core/itemRepository.interface";
import { ItemEntity } from "../../core/entities/item.entity";
import { ItemModel } from "../database/models/Item.model";
import { PaginationParams, PaginatedResponse } from "../../../lists/core/listRepository.interface";

export class ItemRepository implements ItemRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {}

  async saveItem(item: ItemEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ItemModel)
      .values([
        {
          uuid: item.uuid,
          name: item.name,
          description: item.description,
          value: item.value,
          user_id: item.userId,
        },
      ])
      .execute();
  }

  async updateItem(item: ItemEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(ItemModel)
      .set({
        name: item.name,
        description: item.description,
        value: item.value,
      })
      .where("uuid = :uuid", { uuid: item.uuid })
      .execute();
  }

  async deleteItem(uuid: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .softDelete()
      .from(ItemModel)
      .where("uuid = :uuid", { uuid })
      .execute();
  }

  async findItemByUuid(uuid: string): Promise<ItemEntity> {
    const itemDb = await this.dataSource
      .getRepository(ItemModel)
      .createQueryBuilder("item")
      .where("item.uuid = :uuid", { uuid })
      .getOne();

    if (!itemDb) {
      return null;
    }

    return new ItemEntity({
      uuid: itemDb.uuid,
      name: itemDb.name,
      description: itemDb.description,
      value: itemDb.value,
      userId: itemDb.user_id,
      createdAt: itemDb.created_at,
      updatedAt: itemDb.updated_at,
      deletedAt: itemDb.deleted_at,
    });
  }

  async findAllItemsByUserId(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<ItemEntity>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [itemsDb, total] = await this.dataSource
      .getRepository(ItemModel)
      .createQueryBuilder("item")
      .where("item.user_id = :userId", { userId })
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = itemsDb.map(
      (item) =>
        new ItemEntity({
          uuid: item.uuid,
          name: item.name,
          description: item.description,
          value: item.value,
          userId: item.user_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          deletedAt: item.deleted_at,
        })
    );

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async searchItems(userId: string, searchTerm: string, pagination?: PaginationParams): Promise<PaginatedResponse<ItemEntity>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [itemsDb, total] = await this.dataSource
      .getRepository(ItemModel)
      .createQueryBuilder("item")
      .where("item.user_id = :userId", { userId })
      .andWhere("(item.name ILIKE :searchTerm OR item.description ILIKE :searchTerm)", {
        searchTerm: `%${searchTerm}%`,
      })
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = itemsDb.map(
      (item) =>
        new ItemEntity({
          uuid: item.uuid,
          name: item.name,
          description: item.description,
          value: item.value,
          userId: item.user_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          deletedAt: item.deleted_at,
        })
    );

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
} 