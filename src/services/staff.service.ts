import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { Staff } from "../entities/staff.entity";
const repository = AppDataSource.getRepository(Staff);
class StaffService extends BaseService<Staff> {
  constructor() {
    super(repository);
  }
}

export const staffService = new StaffService();
