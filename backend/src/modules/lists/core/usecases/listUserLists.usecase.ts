import { ListRepositoryInterface, PaginationParams } from "../listRepository.interface";

export class ListUserListsUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  async execute(userId: string, pagination?: PaginationParams) {
    if (!userId) {
      throw new Error("O ID do usuário não pode estar vazio.");
    }

    const result = await this.repository.findAllListsByUserId(userId, pagination);
    return {
      ...result,
      data: result.data.map((list) => list.output())
    };
  }
} 