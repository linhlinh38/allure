import express from 'express';
import { handleMulterErrors, uploadFile } from '../configs/muterConfig';
import FileController from '../controllers/file.controller';

const orderRouter = express.Router();
orderRouter.post(
  '/create',
  handleMulterErrors,
  FileController.upload
);
orderRouter.delete('/delete', FileController.delete);
export default orderRouter;
