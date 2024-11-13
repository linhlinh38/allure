import { AppDataSource } from "../dataSource";
import { FilterDTO } from "../dtos/other/filter.dto";
import { Brand } from "../entities/brand.entity";
import { BadRequestError } from "../errors/error";
import { accountRepository } from "../repositories/account.repository";
import { brandRepository } from "../repositories/brand.repository";
import { BaseService } from "./base.service";


const repository = AppDataSource.getRepository(Brand);
class BrandService extends BaseService<Brand> {
  constructor() {
    super(repository);
  }

  async filter(filters: FilterDTO[]){
    const query = repository.createQueryBuilder('brand');

    filters.forEach((filter) => {
      const { option, value } = filter;

      switch (option) {
        case 'name':
          query.andWhere('brand.name ILIKE :name', { name: `%${value}%` });
          break;
        case 'status':
          query.andWhere('brand.status = :status', { status: value });
          break;
        case 'email':
          query.andWhere('brand.email = :email', { email: value });
          break;
        case 'address':
          query.andWhere('brand.address ILIKE :address', {
            address: `%${value}%`,
          });
          break;
        default:
          break;
      }
    });
    return await query.getMany();
  }

  async requestCreateBrand(managerId: string, brand: Brand) {
    console.log("brand", brand.name);
    const tryBrand = await brandRepository.findBy({
      ['name']: '123',
    });
    console.log(tryBrand);
    
    const existBrandByName = await brandService.findBy("123", 'name');
    if (existBrandByName) {
      throw new BadRequestError('Name already exists');
    }
    const manager = await accountRepository.findOne({
      where: { id: managerId },
    });
    if (!manager) {
      throw new BadRequestError('Manager not found');
    }

    const newBrand = brandRepository.create(brand);
    newBrand.accounts = [manager]; 

    return await brandRepository.save(newBrand);
  }
}

export const brandService = new BrandService();