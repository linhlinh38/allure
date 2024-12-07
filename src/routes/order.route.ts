import express from 'express';
import authentication from '../middleware/authentication';
import OrderController from '../controllers/order.controller';
import { SearchOrderSchema } from '../dtos/request/order.request';
import validate from '../utils/validate';

const orderRouter = express.Router();
orderRouter.get('/', OrderController.getAll);
orderRouter.get('/get-by-brand/:brandId', OrderController.getByBrand);
orderRouter.post(
  '/get-my-orders/',
  validate(SearchOrderSchema),
  OrderController.getMyOrders
);
orderRouter.use(authentication);
orderRouter.post(
  '/create-normal',
  OrderController.createNormal
);
export default orderRouter;
