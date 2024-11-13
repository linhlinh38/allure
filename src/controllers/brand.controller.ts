import { NextFunction, Request, Response } from 'express';
import { brandService } from '../services/brand.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { BrandResponse } from '../dtos/response/brand.response';
import { Brand } from '../entities/brand.entity';
import { AppDataSource } from '../dataSource';
import { createBadResponse, createNormalResponse } from '../utils/response';
import { AuthRequest } from '../middleware/authentication';
import { FilterDTO } from '../dtos/other/filter.dto';

export default class BrandController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.findAll();
      const responseData = plainToInstance(BrandResponse, brands);
      return res
        .status(200)
        .send({ message: 'Get all brands success', data: responseData });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const brand: Brand = await brandService.findById(req.params.id);
      const responseData = plainToClass(BrandResponse, brand);
      if (!responseData) return createBadResponse(res, 'Brand not found!');
      return createNormalResponse(res, 'Get brand success', responseData);
    } catch (err) {
      next(err);
    }
  }

  static async filter(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: FilterDTO[] = req.body.filters as FilterDTO[];
      const brand: Brand[] = await brandService.filter(filters);
      const responseData = plainToInstance(BrandResponse, brand);
      return createNormalResponse(res, 'Get brands success', responseData);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const brand: Brand = await brandService.findById(req.params.id);
      if (!brand) return createBadResponse(res, 'No brand found');
      brandService.update(brand.id, req.body.status);
      return createNormalResponse(res, 'Update status success');
    } catch (err) {
      next(err);
    }
  }

  static async requestCreateBrand(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      brandService.requestCreateBrand(req.loginUser, req.body as Brand);
      return createNormalResponse(res, 'Create request success');
    } catch (err) {
      next(err);
    }
  }
}
