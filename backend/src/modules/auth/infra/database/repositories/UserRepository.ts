import { DataSource } from "typeorm";
import { UserRepositoryInterface } from "../../../core/userRepository.interface";
import { UserEntity } from "../../../core/entities/user.entity";
import { UserModel } from "../models/User.model";
import { PaginationParams, PaginatedResponse } from "../../../../lists/core/listRepository.interface";

export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {}

  async saveUser(user: UserEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserModel)
      .values([
        {
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      ])
      .execute();
  }

  async updateUser(user: UserEntity): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(UserModel)
      .set({
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .where("uuid = :uuid", { uuid: user.uuid })
      .execute();
  }

  async deleteUser(uuid: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .softDelete()
      .from(UserModel)
      .where("uuid = :uuid", { uuid })
      .execute();
  }

  async findUserByUuid(uuid: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder("user")
      .where("user.uuid = :uuid", { uuid })
      .getOne();

    if (!userDb) {
      return null;
    }

    return new UserEntity({
      uuid: userDb.uuid,
      name: userDb.name,
      email: userDb.email,
      password: userDb.password,
      createdAt: userDb.created_at,
      updatedAt: userDb.updated_at,
      deletedAt: userDb.deleted_at,
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const userDb = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();

    if (!userDb) {
      return null;
    }

    return new UserEntity({
      uuid: userDb.uuid,
      name: userDb.name,
      email: userDb.email,
      password: userDb.password,
      createdAt: userDb.created_at,
      updatedAt: userDb.updated_at,
      deletedAt: userDb.deleted_at,
    });
  }

  async findAllUsers(pagination?: PaginationParams): Promise<PaginatedResponse<UserEntity>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [usersDb, total] = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder("user")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const users = usersDb.map(
      (user) =>
        new UserEntity({
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          deletedAt: user.deleted_at,
        })
    );

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async searchUsers(searchTerm: string, pagination?: PaginationParams): Promise<PaginatedResponse<UserEntity>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [usersDb, total] = await this.dataSource
      .getRepository(UserModel)
      .createQueryBuilder("user")
      .where("(user.name ILIKE :searchTerm OR user.email ILIKE :searchTerm)", {
        searchTerm: `%${searchTerm}%`,
      })
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const users = usersDb.map(
      (user) =>
        new UserEntity({
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          deletedAt: user.deleted_at,
        })
    );

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
} 