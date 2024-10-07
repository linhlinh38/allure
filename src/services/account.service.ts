import { Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
const repository = AppDataSource.getRepository(Account);
class AccountService extends BaseService<Account> {
  constructor() {
    super(repository);
  }
}

export const accountService = new AccountService();
