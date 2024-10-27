import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { Consultant } from "../entities/consultant.entity";
const repository = AppDataSource.getRepository(Consultant);
class ConsultantService extends BaseService<Consultant> {
  constructor() {
    super(repository);
  }
}

export const consultantService = new ConsultantService();
