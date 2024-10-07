import { Account } from "../entities/account.entity";
import { accountService } from "../services/account.service";
import { NextFunction, Request, Response } from "express";

async function getAllAccount(req: Request, res: Response) {
  const accounts = await accountService.findAll();
  return res
    .status(200)
    .send({ message: "Get all account success", data: accounts });
}

async function getAccountById(req: Request, res: Response) {
  const account = await accountService.findById(
    req.params.value,
    req.params.option as unknown as string
  );
  return res
    .status(200)
    .send({ message: "Get all account success", data: account });
}

async function createAccount(req: Request, res: Response) {
  const account = await accountService.create(req.body as Account);
  return res
    .status(200)
    .send({ message: "Create account success", data: account });
}

async function updateAccount(req: Request, res: Response) {
  const account = await accountService.update(
    req.params.id,
    req.body as Account
  );
  return res
    .status(200)
    .send({ message: "Update account success", data: account });
}

async function deleteAccount(req: Request, res: Response) {
  const account = await accountService.delete(
    req.params.id as unknown as number
  );
  return res
    .status(204)
    .send({ message: "Delete account success", data: account });
}

export const accountController = {
  getAllAccount,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
