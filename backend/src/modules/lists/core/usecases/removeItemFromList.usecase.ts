import { ListRepositoryInterface } from "../listRepository.interface";

export class RemoveItemFromListUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  public async execute(listUuid: string, itemUuid: string, userId: string): Promise<void> {
    const list = await this.repository.findListByUuid(listUuid);
    if (!list) {
      throw new Error("Lista não encontrada.");
    }

    if (list.userId !== userId) {
      throw new Error("Você não tem permissão para modificar esta lista.");
    }

    const itemExists = list.items.some((item) => item.uuid === itemUuid);
    if (!itemExists) {
      throw new Error("Este item não está na lista.");
    }

    await this.repository.removeItemFromList(listUuid, itemUuid);
  }
} 