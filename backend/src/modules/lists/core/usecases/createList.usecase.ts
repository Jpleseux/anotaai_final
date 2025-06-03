import { ListRepositoryInterface } from "../listRepository.interface";
import { ListEntity } from "../entities/List.entity";
import { randomUUID } from "crypto";
import { CreateListInput } from "../types/types";

export class CreateListUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  public async execute(input: CreateListInput): Promise<void> {
    await this.validateInput(input);

    const list = new ListEntity({
      uuid: randomUUID(),
      name: input.name,
      description: input.description,
      userId: input.userId,
      items: [],
    });

    await this.repository.saveList(list);
  }

  private async validateInput(input: CreateListInput): Promise<void> {
    if (!input.name) {
      throw new Error("O nome da lista não pode estar vazio.");
    }

    if (!input.userId) {
      throw new Error("O ID do usuário não pode estar vazio.");
    }
  }
} 