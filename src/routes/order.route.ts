import express from 'express';
import authentication from '../middleware/authentication';
import OrderController from '../controllers/order.controller';

const orderRouter = express.Router();
orderRouter.get('/', OrderController.getAll);
orderRouter.get('/get-by-brand/:brandId', OrderController.getByBrand);
orderRouter.use(authentication);
orderRouter.post(
  '/create-normal',
  OrderController.createNormal
);
export default orderRouter;
