import { Router } from "express";
import { ItemController } from "../controllers/ItemController";
import { CreateItemUsecase } from "../../modules/itens/core/usecases/createItem.usecase";
import { UpdateItemUsecase } from "../../modules/itens/core/usecases/updateItem.usecase";
import { DeleteItemUsecase } from "../../modules/itens/core/usecases/deleteItem.usecase";
import { SearchItemsUsecase } from "../../modules/itens/core/usecases/searchItems.usecase";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ItemRepository } from "../../modules/itens/infra/repository/ItemRepository";
import AppDataSource from "../../infrastructure/database/config";
import { FindItemByUuidUsecase } from "../../modules/itens/core/usecases/findItemByUuid.usecase";
import { FindItemsByListUsecase } from "../../modules/itens/core/usecases/findItemsByList.usecase";

const itemRoutes = Router();
const itemRepository = new ItemRepository(AppDataSource);
const createItemUsecase = new CreateItemUsecase(itemRepository);
const updateItemUsecase = new UpdateItemUsecase(itemRepository);
const deleteItemUsecase = new DeleteItemUsecase(itemRepository);
const searchItemsUsecase = new SearchItemsUsecase(itemRepository);
const findItemByUuidUsecase = new FindItemByUuidUsecase(itemRepository);
const findItemsByListUsecase = new FindItemsByListUsecase(itemRepository);
const itemController = new ItemController(
  createItemUsecase,
  updateItemUsecase,
  deleteItemUsecase,
  searchItemsUsecase,
  findItemByUuidUsecase,
  findItemsByListUsecase
);

itemRoutes.use(authMiddleware);

itemRoutes.post("/", (req, res) => itemController.createItem(req, res));
itemRoutes.put("/:uuid", (req, res) => itemController.updateItem(req, res));
itemRoutes.delete("/:uuid", (req, res) => itemController.deleteItem(req, res));
itemRoutes.get("/", (req, res) => itemController.searchItems(req, res));
itemRoutes.get("/:uuid", (req, res) => itemController.getItems(req, res));
itemRoutes.get("/list/:uuid", (req, res) => itemController.getItemsByList(req, res));



export { itemRoutes }; 