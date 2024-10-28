import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { KOL } from "../entities/KOL.entity";
const repository = AppDataSource.getRepository(KOL);
class KOL_Service extends BaseService<KOL> {
  constructor() {
    super(repository);
  }
}

export const KOLService = new KOL_Service();
