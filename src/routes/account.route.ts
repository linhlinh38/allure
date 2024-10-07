import express from "express";
import { accountController } from "../controller/account.controller";
const accountRouter = express.Router();

accountRouter.get("/", accountController.getAllAccount);
accountRouter.get("/profile/:option/:value", accountController.getAccountById);
accountRouter.post("/", accountController.createAccount);
accountRouter.put("/:id", accountController.updateAccount);
accountRouter.delete("/:id", accountController.deleteAccount);
export default accountRouter;
