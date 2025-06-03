import { ListRepositoryInterface } from "../listRepository.interface";
import { ListEntity } from "../entities/List.entity";
import { UpdateListInput } from "../types/types";

export class UpdateListUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  public async execute(input: UpdateListInput): Promise<void> {
    const existingList = await this.repository.findListByUuid(input.uuid);
    if (!existingList) {
      throw new Error("Lista não encontrada.");
    }

    if (existingList.userId !== input.userId) {
      throw new Error("Você não tem permissão para atualizar esta lista.");
    }

    const updatedList = new ListEntity({
      uuid: existingList.uuid,
      name: input.name ?? existingList.name,
      description: input.description ?? existingList.description,
      userId: input.userId,
      items: existingList.items,
      createdAt: existingList.createdAt,
      updatedAt: existingList.updatedAt,
      deletedAt: existingList.deletedAt,
    });

    await this.validateInput(updatedList);
    await this.repository.updateList(updatedList);
  }

  private async validateInput(list: ListEntity): Promise<void> {
    if (!list.name) {
      throw new Error("O nome da lista não pode estar vazio.");
    }
  }
} 