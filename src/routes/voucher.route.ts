import express from 'express';
import validate from '../utils/validate';
import authentication from '../middleware/authentication';
import VoucherController from '../controllers/voucher.controller';
import {
  VoucherCreateSchema,
  VoucherUpdateSchema,
  VoucherUpdateStatusSchema,
} from '../dtos/request/voucher.request';
const voucherRouter = express.Router();
voucherRouter.get('/', VoucherController.getAll);
voucherRouter.get('/get-by-brand/:brandId', VoucherController.getByBrand);
voucherRouter.get(
  '/get-platform-vouchers',
  VoucherController.getPlatformVouchers
);
voucherRouter.get(
  '/get-best-shop-vouchers-for-products',
  VoucherController.getBestShopVouchersForProducts
);

voucherRouter.get('/get-by-id/:id', VoucherController.getById);
voucherRouter.post('/search', VoucherController.search);
voucherRouter.post(
  '/create',
  validate(VoucherCreateSchema),
  VoucherController.create
);
voucherRouter.put(
  '/update-detail/:id',
  validate(VoucherUpdateSchema),
  VoucherController.updateDetail
);
voucherRouter.put(
  '/update-status/:id',
  validate(VoucherUpdateStatusSchema),
  VoucherController.updateStatus
);
voucherRouter.use(authentication);
voucherRouter.post(
  '/collect-voucher/:voucherId',
  VoucherController.collectVoucher
);
export default voucherRouter;
