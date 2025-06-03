import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MigrationLists1706129063136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "lists",
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isPrimary: true,
            primaryKeyConstraintName: "PK_lists",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
            default: null,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "user_id",
            type: "uuid",
          },
        ],
        foreignKeys: [
          {
            name: "FK_lists_users",
            columnNames: ["user_id"],
            referencedTableName: "auth_users",
            referencedColumnNames: ["uuid"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "list_items",
        columns: [
          {
            name: "list_id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "item_id",
            type: "uuid",
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            name: "FK_list_items_lists",
            columnNames: ["list_id"],
            referencedTableName: "lists",
            referencedColumnNames: ["uuid"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          {
            name: "FK_list_items_items",
            columnNames: ["item_id"],
            referencedTableName: "items",
            referencedColumnNames: ["uuid"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("list_items");
    await queryRunner.dropTable("lists");
  }
} 