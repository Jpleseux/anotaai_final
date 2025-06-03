import { ItemEntity } from "./entities/item.entity";
import { PaginationParams, PaginatedResponse } from "../../lists/core/listRepository.interface";

export interface ItemRepositoryInterface {
    saveItem(item: ItemEntity): Promise<void>;
    updateItem(item: ItemEntity): Promise<void>;
    deleteItem(uuid: string): Promise<void>;
    findItemByUuid(uuid: string): Promise<ItemEntity>;
    findAllItemsByUserId(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<ItemEntity>>;
    searchItems(userId: string, searchTerm: string, pagination?: PaginationParams): Promise<PaginatedResponse<ItemEntity>>;
}