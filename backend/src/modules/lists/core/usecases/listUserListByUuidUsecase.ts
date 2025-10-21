import { ListRepositoryInterface, PaginationParams } from "../listRepository.interface";

export class FindListByUuidUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  async execute(uuid: string  ) {
    if (!uuid) {
      throw new Error("O ID da lista não pode estar vazio.");
    }

    const result = await this.repository.findListByUuid(uuid);
    const data = result.output()
    return {
      data: data,
    };
  }
} 