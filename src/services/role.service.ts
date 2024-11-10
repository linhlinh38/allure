import { AppDataSource } from "../dataSource";
import { Role } from "../entities/role.entity";
import { BaseService } from "./base.service";

const repository = AppDataSource.getRepository(Role);
class RoleService extends BaseService<Role> {
  constructor() {
    super(repository);
  }
}
export const roleService = new RoleService();
