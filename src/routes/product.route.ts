import express from "express";
import authentication from "../middleware/authentication";
import validate from "../utils/validate";
import {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "../dtos/request/product.request";
import ProductController from "../controllers/product.controller";

const productRouter = express.Router();

productRouter.use(authentication);
productRouter.post(
  "/",
  validate(ProductCreateSchema),
  ProductController.create
);

productRouter.get("/get-by-id/:id", ProductController.getById);
productRouter.get("/", ProductController.getAll);
productRouter.put(
  "/:id",
  validate(ProductUpdateSchema),
  ProductController.update
);
export default productRouter;
