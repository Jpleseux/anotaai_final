import { ItemEntity } from "./entities/item.entity";
import { PaginationParams } from "../../lists/core/listRepository.interface";

export interface ItemRepositoryInterface {
    saveItem(item: ItemEntity, listId: string): Promise<void>;
    updateItem(item: ItemEntity): Promise<void>;
    deleteItem(uuid: string): Promise<void>;
    findItemByUuid(uuid: string): Promise<ItemEntity>;
    findItemsByList(listId: string, userId: string): Promise<ItemEntity[]>;
    searchItems(userId: string, pagination?: PaginationParams): Promise<{
        data: ItemEntity[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}