import { ItemRepositoryInterface } from "../itemRepository.interface";
import { AppError } from "../../../../core/errors/AppError";

export class FindItemByUuidUsecase {
  constructor(private repository: ItemRepositoryInterface) {}

  async execute(uuid: string, userId: string) {
    if (!uuid) {
      throw new AppError("O ID do item não pode estar vazio.", 400);
    }

    const item = await this.repository.findItemByUuid(uuid);

    if (!item) {
      throw new AppError("Item não encontrado.", 404);
    }

    if (item.userId !== userId) {
      throw new AppError("Você não tem permissão para acessar este item.", 403);
    }

    return item.output();
  }
} 