import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { createNormalResponse } from '../utils/response';
import { plainToInstance } from 'class-transformer';
import { OrderNormalRequest } from '../dtos/request/order.request';
import { AuthRequest } from '../middleware/authentication';
import { orderRepository } from '../repositories/order.repository';

export default class OrderController {
  static async getByBrand(req: Request, res: Response, next: NextFunction) {
    try {
      return createNormalResponse(
        res,
        'Get orders by brand success',
        await orderService.getByBrand(req.params.brandId)
      );
    } catch (err) {
      next(err);
    }
  }
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllTotalOrders();
      return createNormalResponse(res, 'Get all orders success', orders);
    } catch (err) {
      next(err);
    }
  }

  static async createNormal(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orderNormalBody = plainToInstance(OrderNormalRequest, req.body, {
        excludeExtraneousValues: true,
      });
      await orderService.createNormal(orderNormalBody, req.loginUser);
      return createNormalResponse(res, 'Create order successfully');
    } catch (err) {
      next(err);
    }
  }
}
