import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { createNormalResponse } from '../utils/response';
import { plainToInstance } from 'class-transformer';
import { OrderNormalRequest } from '../dtos/request/order.request';
import { AuthRequest } from '../middleware/authentication';

export default class OrderController {
  static async createNormal(req: AuthRequest, res: Response, next: NextFunction) {
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