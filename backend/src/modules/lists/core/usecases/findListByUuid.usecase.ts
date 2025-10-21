import { ListRepositoryInterface, PaginationParams } from "../listRepository.interface";
import { AppError } from "../../../../core/errors/AppError";

export class FindListByUuidUsecase {
  constructor(private repository: ListRepositoryInterface) {}

  async execute(uuid: string) {
    if (!uuid) {
      throw new AppError("O ID da lista não pode estar vazio.", 400);
    }

    const result = await this.repository.findListByUuid(uuid);
    
    if (!result) {
      throw new AppError("Lista não encontrada.", 404);
    }

    const data = result.output();
    console.log("List data:", data);
    
    return {
      data: data,
    };
  }
} 