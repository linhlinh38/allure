import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';

export default class OrderController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];
    try {
      res.status(200).json({
        message: 'Upload success',
        data: "",
      });
    } catch (err) {
      next(err);
    }
  }
}