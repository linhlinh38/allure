import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { Customer } from "../entities/customer.entity";
const repository = AppDataSource.getRepository(Customer);
class CustomerService extends BaseService<Customer> {
  constructor() {
    super(repository);
  }
}

export const customerService = new CustomerService();
