import { AppDataSource } from "../dataSource";
import { Product } from "../entities/product.entity";
import { ProductClassification } from "../entities/productClassification";
import { BadRequestError } from "../errors/error";
import { StatusEnum } from "../utils/enum";
import { BaseService } from "./base.service";
import { brandService } from "./brand.service";
import { categoryService } from "./category.service";

const repository = AppDataSource.getRepository(Product);
class ProductService extends BaseService<Product> {
  constructor() {
    super(repository);
  }

  async getAll() {
    const product = await repository.find({
      relations: ["category", "brand", "productClassifications"],
    });

    return product;
  }
  async getById(id: string) {
    const product = await repository.find({
      where: { id },
      relations: ["category", "brand", "productClassifications"],
    });

    return product;
  }

  async beforeCreate(body: Product) {
    if (body.category) {
      const checkCategory = await categoryService.findById(body.category);
      if (!checkCategory) throw new BadRequestError("Category not found");
    }
    if (body.brand) {
      const checkBrand = await brandService.findById(body.brand);
      if (!checkBrand || checkBrand.status !== StatusEnum.ACTIVE)
        throw new BadRequestError("Brand not found");
    }
  }

  async createProduct(productData: Product): Promise<Product> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.save(Product, productData);

      let productClassification: ProductClassification[] = [];
      if (
        productData.productClassifications &&
        productData.productClassifications.length > 0
      ) {
        const classificationsWithProduct =
          productData.productClassifications.map((classification) => ({
            ...classification,
            product,
          }));
        productClassification = await queryRunner.manager.save(
          ProductClassification,
          classificationsWithProduct
        );
      }

      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
export const productService = new ProductService();
