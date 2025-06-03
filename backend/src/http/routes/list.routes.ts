import { Router } from "express";
import { ListController } from "../controllers/ListController";
import { CreateListUsecase } from "../../modules/lists/core/usecases/createList.usecase";
import { UpdateListUsecase } from "../../modules/lists/core/usecases/updateList.usecase";
import { DeleteListUsecase } from "../../modules/lists/core/usecases/deleteList.usecase";
import { ListUserListsUsecase } from "../../modules/lists/core/usecases/listUserLists.usecase";
import { AddItemToListUsecase } from "../../modules/lists/core/usecases/addItemToList.usecase";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ListRepository } from "../../modules/lists/infra/repository/ListRepository";
import AppDataSource from "../../infrastructure/database/config";

const listRoutes = Router();
const listRepository = new ListRepository(AppDataSource);
const createListUsecase = new CreateListUsecase(listRepository);
const updateListUsecase = new UpdateListUsecase(listRepository);
const deleteListUsecase = new DeleteListUsecase(listRepository);
const listUserListsUsecase = new ListUserListsUsecase(listRepository);
const addItemToListUsecase = new AddItemToListUsecase(listRepository);
const listController = new ListController(
  createListUsecase,
  updateListUsecase,
  deleteListUsecase,
  listUserListsUsecase,
  addItemToListUsecase
);

listRoutes.use(authMiddleware);

listRoutes.post("/", (req, res) => listController.createList(req, res));
listRoutes.put("/:uuid", (req, res) => listController.updateList(req, res));
listRoutes.delete("/:uuid", (req, res) => listController.deleteList(req, res));
listRoutes.get("/", (req, res) => listController.listUserLists(req, res));
listRoutes.post("/:uuid/items", (req, res) => listController.addItemToList(req, res));

export { listRoutes }; 