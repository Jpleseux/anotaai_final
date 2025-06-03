import { ItemRepositoryInterface } from "../itemRepository.interface";
import { ItemEntity } from "../entities/item.entity";
import { randomUUID } from "crypto";
import { CreateItemInput } from "../types/types";

export class CreateItemUsecase {
  constructor(private repository: ItemRepositoryInterface) {}

  public async execute(input: CreateItemInput): Promise<void> {
    await this.validateInput(input);

    const item = new ItemEntity({
      uuid: randomUUID(),
      name: input.name,
      description: input.description,
      value: input.value,
      userId: input.userId,
    });

    await this.repository.saveItem(item);
  }

  private async validateInput(input: CreateItemInput): Promise<void> {
    if (!input.name) {
      throw new Error("O nome do item não pode estar vazio.");
    }

    if (!input.description) {
      throw new Error("A descrição do item não pode estar vazia.");
    }

    if (input.value <= 0) {
      throw new Error("O valor do item deve ser maior que zero.");
    }

    if (!input.userId) {
      throw new Error("O ID do usuário não pode estar vazio.");
    }
  }
} 