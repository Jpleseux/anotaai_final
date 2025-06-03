import { ListEntity } from "./entities/List.entity";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListRepositoryInterface {
  saveList(list: ListEntity): Promise<void>;
  updateList(list: ListEntity): Promise<void>;
  deleteList(uuid: string): Promise<void>;
  findListByUuid(uuid: string): Promise<ListEntity>;
  findAllListsByUserId(userId: string, pagination?: PaginationParams): Promise<PaginatedResponse<ListEntity>>;
  addItemToList(listUuid: string, itemUuid: string): Promise<void>;
  removeItemFromList(listUuid: string, itemUuid: string): Promise<void>;
} 