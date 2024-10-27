import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { Manager } from "../entities/manager.entity";
const repository = AppDataSource.getRepository(Manager);
class ManagerService extends BaseService<Manager> {
  constructor() {
    super(repository);
  }
}

export const managerService = new ManagerService();
