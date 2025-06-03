import { AppError } from "../../../../core/errors/AppError";import { ItemEntity } from "../entities/item.entity";
import { ItemRepositoryInterface } from "../itemRepository.interface";

interface UpdateItemInput {
  uuid: string;
  name: string;
  description: string;
  value: number;
  userId: string;
}

export class UpdateItemUsecase {
  constructor(private itemRepository: ItemRepositoryInterface) {}

  async execute(input: UpdateItemInput): Promise<void> {
    const { uuid, name, description, value, userId } = input;

    const item = await this.itemRepository.findItemByUuid(uuid);
    if (!item) {
      throw new AppError("Item não encontrado");
    }

    if (item.userId !== userId) {
      throw new AppError("Você não tem permissão para atualizar este item");
    }

    const updatedItem = new ItemEntity({
      uuid,
      name,
      description,
      value,
      userId,
    });

    await this.itemRepository.updateItem(updatedItem);
  }
} 