import { ItemRepositoryInterface } from "../itemRepository.interface";
import { AppError } from "../../../../core/errors/AppError";

export class FindItemsByListUsecase {
  constructor(private repository: ItemRepositoryInterface) {}

  async execute(listId: string, userId: string) {
    if (!listId) {
      throw new AppError("O ID da lista não pode estar vazio.", 400);
    }

    const items = await this.repository.findItemsByList(listId, userId);
    return items.map(item => item.output());
  }
} 