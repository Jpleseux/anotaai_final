import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ItemModel } from "../../../../itens/infra/database/models/Item.model";

@Entity("list_items")
export class ListItemModel {
  @PrimaryColumn("uuid")
  list_id: string;

  @PrimaryColumn("uuid")
  item_id: string;

  @ManyToOne(() => ItemModel)
  @JoinColumn({ name: "item_id" })
  item: ItemModel;
} 