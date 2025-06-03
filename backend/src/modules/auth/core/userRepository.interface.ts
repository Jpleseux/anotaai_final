import { UserEntity } from "./entities/user.entity";
import { PaginationParams, PaginatedResponse } from "../../lists/core/listRepository.interface";

export interface UserRepositoryInterface {
  saveUser(user: UserEntity): Promise<void>;
  updateUser(user: UserEntity): Promise<void>;
  deleteUser(uuid: string): Promise<void>;
  findUserByUuid(uuid: string): Promise<UserEntity>;
  findUserByEmail(email: string): Promise<UserEntity>;
  findAllUsers(pagination?: PaginationParams): Promise<PaginatedResponse<UserEntity>>;
  searchUsers(searchTerm: string, pagination?: PaginationParams): Promise<PaginatedResponse<UserEntity>>;
} 