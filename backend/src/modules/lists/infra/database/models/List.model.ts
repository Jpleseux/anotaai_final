import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("lists")
export class ListModel {
  @PrimaryColumn("uuid")
  uuid: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column("uuid")
  user_id: string;
} 