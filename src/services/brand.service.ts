import { StatusTracking } from "../entities/statusTracking.entity";
import { Not } from "typeorm";
import { AppDataSource } from "../dataSource";
import { SearchDTO } from "../dtos/other/search.dto";
import { Brand } from "../entities/brand.entity";
import { BadRequestError } from "../errors/error";
import { accountRepository } from "../repositories/account.repository";
import { brandRepository } from "../repositories/brand.repository";
import { BaseService } from "./base.service";
import { followRepository } from "../repositories/follow.repository";
import { accountService } from "./account.service";
import { BrandUpdateStatusRequest } from "../dtos/request/brand.request";
import { StatusEnum } from "../utils/enum";
import { brandStatusTrackingRepository } from "../repositories/brandStatusTracking.repository";

const repository = AppDataSource.getRepository(Brand);
class BrandService extends BaseService<Brand> {
  async getStatusTrackings(brandId: string) {
    const brand = await brandRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) throw new BadRequestError("Brand not found");
    const statusTrackings = await brandStatusTrackingRepository.find({
      relations: { brand: true, updatedBy: true },
      where: { brand: { id: brandId } },
      order: { createdAt: "DESC" },
    });
    return statusTrackings;
  }
  async updateStatus(
    loginUser: string,
    brandUpdateStatusRequest: BrandUpdateStatusRequest
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await accountRepository.findOne({
        where: { id: loginUser },
      });
      const brand = await brandRepository.findOne({
        where: { id: brandUpdateStatusRequest.brandId },
      });
      if (!brand) throw new BadRequestError("Brand not found");
      if (
        brandUpdateStatusRequest.status == StatusEnum.DENIED &&
        !brandUpdateStatusRequest.reason
      ) {
        throw new BadRequestError("Reason is required");
      }
      const brandStatusTracking = new StatusTracking();
      brandStatusTracking.reason = brandUpdateStatusRequest.reason;
      brandStatusTracking.status = brandUpdateStatusRequest.status;
      brandStatusTracking.updatedBy = account;
      brandStatusTracking.brand = brand;
      await queryRunner.manager.save(StatusTracking, brandStatusTracking);

      brand.status = brandUpdateStatusRequest.status;
      await queryRunner.manager.save(Brand, brand);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  constructor() {
    super(repository);
  }

  async search(searches: SearchDTO[]) {
    const query = repository.createQueryBuilder("brand");

    searches.forEach((search) => {
      const { option, value } = search;

      switch (option) {
        case "name":
          query.andWhere("brand.name ILIKE :name", { name: `%${value}%` });
          break;
        case "status":
          query.andWhere("brand.status = :status", { status: value });
          break;
        case "email":
          query.andWhere("brand.email = :email", { email: value });
          break;
        case "address":
          query.andWhere("brand.address ILIKE :address", {
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
    const existBrandByName = await brandRepository.findOneBy({
      ["name"]: brand.name,
    });
    if (existBrandByName) {
      throw new BadRequestError("Name already exists");
    }
    const manager = await accountRepository.findOne({
      where: { id: managerId },
    });

    if (!manager) {
      throw new BadRequestError("Manager not found");
    }

    const newBrand = brandRepository.create(brand);
    newBrand.accounts = [manager];

    return await brandRepository.save(newBrand);
  }

  async updateDetail(id: string, brandBody: Brand) {
    const brand: Brand = await brandService.findById(id);
    if (!brand) throw new BadRequestError("Brand not found");
    const existBrandByName = await brandRepository.findOne({
      where: {
        name: brandBody.name,
        id: Not(id),
      },
    });
    if (existBrandByName) {
      throw new BadRequestError("Name already exists");
    }
    if (brand.status == StatusEnum.DENIED) {
      brandBody.status = StatusEnum.PENDING;
    }
    await this.update(id, brandBody);
  }

  async toggleFollowBrand(accountId: string, brandId: string) {
    const existingFollow = await followRepository.findOne({
      where: {
        account: { id: accountId },
        brand: { id: brandId },
      },
    });
    if (existingFollow) {
      await followRepository.remove(existingFollow);
    } else {
      const account = await accountService.findById(accountId);
      if (!account) throw new BadRequestError("Account not found");
      const brand = await brandService.findById(brandId);
      if (!brand) throw new BadRequestError("Brand not found");
      const newFollow = followRepository.create({ account, brand });
      await followRepository.save(newFollow);
    }
  }

  async getFollowedBrands(accountId: string) {
    const account = await accountService.findById(accountId);
    if (!account) throw new BadRequestError("Account not found");
    const follows = await followRepository.find({
      where: { account: { id: accountId } },
      relations: {
        brand: true,
      },
    });
    return follows.flatMap((follow) => [follow.brand]);
  }
}

export const brandService = new BrandService();
