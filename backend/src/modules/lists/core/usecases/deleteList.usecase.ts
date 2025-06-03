import { ListRepositoryInterface } from "../listRepository.interface";

export class DeleteListUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  public async execute(uuid: string, userId: string): Promise<void> {
    const existingList = await this.repository.findListByUuid(uuid);
    if (!existingList) {
      throw new Error("Lista não encontrada.");
    }

    if (existingList.userId !== userId) {
      throw new Error("Você não tem permissão para deletar esta lista.");
    }

    await this.repository.deleteList(uuid);
  }
} 