import express from "express";
import { accountController } from "../controllers/account.controller";
import authentication from "../middleware/authentication";

const accountRouter = express.Router();

accountRouter.post("/", accountController.createAccount);

accountRouter.use(authentication);
accountRouter.get("/", accountController.getAllAccount);
accountRouter.get("/profile/:option/:value", accountController.getAccountById);
accountRouter.put("/:id", accountController.updateAccount);
accountRouter.delete("/:id", accountController.deleteAccount);
export default accountRouter;
