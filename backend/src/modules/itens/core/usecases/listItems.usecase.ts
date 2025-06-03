import { ItemRepositoryInterface } from "../itemRepository.interface";
import { PaginationParams } from "../../../lists/core/listRepository.interface";

export class ListItemsUsecase {
  constructor(private repository: ItemRepositoryInterface) {}

  async execute(userId: string, pagination?: PaginationParams) {
    const result = await this.repository.findAllItemsByUserId(userId, pagination);
    return {
      ...result,
      data: result.data.map((item) => item.output())
    };
  }
} 