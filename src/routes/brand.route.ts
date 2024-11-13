import express from 'express';
import BrandController from '../controllers/brand.controller';
import { authController } from '../controllers/auth.controller';
import validate from '../utils/validate';
import { BrandUpdateStatusSchema } from '../dtos/request/brand.request';
const brandRoute = express.Router();
brandRoute.get('/', BrandController.getAll);
brandRoute.get('/get-by-id/:id', BrandController.getById);
brandRoute.post('/filter', BrandController.filter);
brandRoute.post('/create', BrandController.requestCreateBrand);
brandRoute.put(
  '/update-status/:id',
  validate(BrandUpdateStatusSchema),
  BrandController.updateStatus
);
brandRoute.put('/update-detail', authController.loginGoogle);
export default brandRoute;
