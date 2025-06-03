import { ItemRepositoryInterface } from "../itemRepository.interface";

export class DeleteItemUsecase {
  constructor(private repository: ItemRepositoryInterface) {}

  public async execute(uuid: string): Promise<void> {
    const existingItem = await this.repository.findItemByUuid(uuid);
    if (!existingItem) {
      throw new Error("Item não encontrado.");
    }

    await this.repository.deleteItem(uuid);
  }
} 