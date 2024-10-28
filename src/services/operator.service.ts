import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { Operator } from "../entities/operator.entity";
const repository = AppDataSource.getRepository(Operator);
class OperatorService extends BaseService<Operator> {
  constructor() {
    super(repository);
  }
}

export const operatorService = new OperatorService();
