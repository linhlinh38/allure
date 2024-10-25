import { Account } from "../entities/account.entity";
import { EmailAlreadyExistError } from "../errors/error";
import { accountService } from "../services/account.service";
import { NextFunction, Request, Response } from "express";
import { encryptedPassword } from "../utils/jwt";

async function getAllAccount(req: Request, res: Response) {
  const accounts = await accountService.findAll();
  return res
    .status(200)
    .send({ message: "Get all account success", data: accounts });
}

async function getAccountById(req: Request, res: Response) {
  const account = await accountService.findBy(
    req.params.value,
    req.params.option as unknown as string
  );
  return res
    .status(200)
    .send({ message: "Get all account success", data: account });
}

async function createAccount(req: Request, res: Response, next: NextFunction) {
  const checkEmail = await accountService.findBy(req.body.email, "email");
  if (checkEmail.length !== 0) {
    throw new EmailAlreadyExistError("Email already exists!");
  }
  if (req.body.password) {
    req.body.password = await encryptedPassword(req.body.password);
  }
  let account;
  try {
    account = await accountService.create(req.body as Account);
    return res
      .status(200)
      .send({ message: "Create account success", data: account });
  } catch (error) {
    next(error);
  }
}

async function updateAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const account = await accountService.update(
      req.params.id,
      req.body as Account
    );
    return res
      .status(200)
      .send({ message: "Update account success", data: account });
  } catch (error) {
    next(error);
  }
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
