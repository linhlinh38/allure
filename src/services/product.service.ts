import { ILike, In, Not } from "typeorm";
import { AppDataSource } from "../dataSource";
import { Product } from "../entities/product.entity";
import { ProductClassification } from "../entities/productClassification.entity";
import { BadRequestError } from "../errors/error";
import {
  ClassificationTypeEnum,
  PreOrderProductEnum,
  ProductDiscountEnum,
  ProductEnum,
  StatusEnum,
} from "../utils/enum";
import { BaseService } from "./base.service";
import { brandService } from "./brand.service";
import { categoryService } from "./category.service";
import { ProductImage } from "../entities/productImage.entity";
import { PreOrderProduct } from "../entities/preOrderProduct.entity";
import { ProductDiscount } from "../entities/productDiscount.entity";

const repository = AppDataSource.getRepository(Product);

interface ProductFilter {
  search?: string; // Search across multiple fields
  sortBy?: keyof Product; // Field to sort by (e.g., "id", "sku")
  order?: string; // Sort order
  limit?: number; // Number of items per page
  page?: number; // Page number (for pagination)
  status?: string; // Filter by status
  brandId?: string; // Filter by brand
  categoryId?: string; // Filter by category
}

class ProductService extends BaseService<Product> {
  constructor() {
    super(repository);
  }

  async getAll() {
    const products = await this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect(
        "product.productClassifications",
        "productClassifications",
        "productClassifications.status = :classificationStatus",
        { classificationStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productClassifications.images",
        "classificationImages",
        "classificationImages.status = :imageStatus",
        { imageStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "product.images",
        "images",
        "images.status = :productImageStatus",
        { productImageStatus: StatusEnum.ACTIVE }
      )
      .getMany();

    return products;
  }
  async getById(id: string) {
    const product = await repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect(
        "product.productClassifications",
        "productClassifications",
        "productClassifications.status = :classificationStatus",
        { classificationStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productClassifications.images",
        "classificationImages",
        "classificationImages.status = :imageStatus",
        { imageStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect(
        "product.productDiscounts",
        "productDiscounts",
        "productDiscounts.status = :discountActiveStatus",
        { discountActiveStatus: ProductDiscountEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productDiscounts.productClassifications",
        "productDiscount_productClassifications",
        "productDiscount_productClassifications.status = :productDiscount_productClassifications",
        { productDiscount_productClassifications: ProductDiscountEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productDiscount_productClassifications.images",
        "productDiscount_productClassifications_images",
        "productDiscount_productClassifications_images.status = :productDiscount_productClassifications_images",
        { productDiscount_productClassifications_images: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "product.preOrderProducts",
        "preOrderProducts",
        "preOrderProducts.status = :preOrderActiveStatus",
        { preOrderActiveStatus: PreOrderProductEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "preOrderProducts.productClassifications",
        "preOrderProduct_productClassifications",
        "preOrderProduct_productClassifications.status = :preOrderProduct_productClassifications",
        { preOrderProduct_productClassifications: PreOrderProductEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "preOrderProduct_productClassifications.images",
        "preOrderProduct_productClassifications_images",
        "preOrderProduct_productClassifications_images.status = :preOrderProduct_productClassifications_images",
        { preOrderProduct_productClassifications_images: StatusEnum.ACTIVE }
      )
      .where("product.id = :id", { id })
      .getOne();

    return product;
  }

  async getByBrand(id: string) {
    const products = await this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect(
        "product.productClassifications",
        "productClassifications",
        "productClassifications.status = :classificationStatus",
        { classificationStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productClassifications.images",
        "classificationImages",
        "classificationImages.status = :imageStatus",
        { imageStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "product.images",
        "images",
        "images.status = :productImageStatus",
        { productImageStatus: StatusEnum.ACTIVE }
      )
      .where("product.brand = :id", { id })
      .getMany();

    return products;
  }

  async getByCategory(id: string) {
    const products = await this.repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect(
        "product.productClassifications",
        "productClassifications",
        "productClassifications.status = :classificationStatus",
        { classificationStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productClassifications.images",
        "classificationImages",
        "classificationImages.status = :imageStatus",
        { imageStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "product.images",
        "images",
        "images.status = :productImageStatus",
        { productImageStatus: StatusEnum.ACTIVE }
      )
      .where("product.category = :id", { id })
      .getMany();

    return products;
  }

  async filteredProducts(filter: ProductFilter): Promise<{
    items: Product[];
    total: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder("product");

    queryBuilder
      .leftJoinAndSelect("product.brand", "brand")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect(
        "product.productClassifications",
        "productClassifications",
        "productClassifications.status = :classificationStatus",
        { classificationStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "productClassifications.images",
        "classification_images",
        "classification_images.status = :imageStatus",
        { imageStatus: StatusEnum.ACTIVE }
      )
      .leftJoinAndSelect(
        "product.images",
        "product_images",
        "product_images.status = :status",
        { status: StatusEnum.ACTIVE }
      );

    if (filter.search) {
      queryBuilder.andWhere(
        "(product.name ILIKE :search OR product.sku ILIKE :search OR product.description ILIKE :search)",
        { search: `%${filter.search}%` }
      );
    }

    if (filter.status) {
      queryBuilder.andWhere("product.status = :status", {
        status: filter.status,
      });
    }

    if (filter.brandId) {
      queryBuilder.andWhere("product.brand.id = :brandId", {
        brandId: filter.brandId,
      });
    }

    if (filter.categoryId) {
      queryBuilder.andWhere("product.category.id = :categoryId", {
        categoryId: filter.categoryId,
      });
    }

    queryBuilder.orderBy(
      `product.${filter.sortBy}`,
      filter.order.toUpperCase() as "ASC" | "DESC"
    );

    queryBuilder.take(filter.limit).skip((filter.page - 1) * filter.limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total };
  }

  async beforeCreate(body: any) {
    if (body.category) {
      const checkCategory = await categoryService.findById(body.category);
      if (!checkCategory) throw new BadRequestError("Category not found");
    }
    if (body.brand) {
      const checkBrand = await brandService.findById(body.brand);

      if (!checkBrand || checkBrand.status !== StatusEnum.ACTIVE) {
        throw new BadRequestError("Brand not found");
      }
    }
    if (body.sku && body.sku !== "") {
      const checkSku = await this.repository.find({
        where: {
          brand: { id: body.brand },
          sku: body.sku,
          status: Not(In([ProductEnum.INACTIVE, ProductEnum.BANNED])),
        },
      });

      if (checkSku.length !== 0)
        throw new BadRequestError("sku already exists");
    }
  }

  async beforeUpdate(id: string, body: any) {
    const product = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    if (!product) throw new BadRequestError("Product not found");

    if (body.category) {
      const checkCategory = await categoryService.findById(body.category);
      if (!checkCategory) throw new BadRequestError("Category not found");
    }
    if (body.brand) {
      const checkBrand = await brandService.findById(body.brand);
      if (!checkBrand || checkBrand.status !== StatusEnum.ACTIVE)
        throw new BadRequestError("Brand not found");
    }
    if (
      body.sku &&
      body.sku !== "" &&
      body?.status !== ProductEnum.BANNED &&
      body?.status !== ProductEnum.INACTIVE &&
      product.status !== ProductEnum.BANNED &&
      product.status !== ProductEnum.INACTIVE
    ) {
      const checkSku = await this.repository.find({
        where: {
          sku: body.sku,
          id: Not(id),
          brand: product.brand,
          status: Not(In([ProductEnum.INACTIVE, ProductEnum.BANNED])),
        },
      });
      if (checkSku.length !== 0)
        throw new BadRequestError("sku already exists");
    }

    if (
      body.status &&
      body.status !== ProductEnum.BANNED &&
      body.status !== ProductEnum.INACTIVE
    ) {
      const checkSku = await this.repository.find({
        where: {
          sku: body.sku ?? product.sku,
          id: Not(id),
          brand: product.brand,
          status: Not(In([ProductEnum.INACTIVE, ProductEnum.BANNED])),
        },
      });

      if (checkSku.length !== 0)
        throw new BadRequestError("sku already exists");
    }
  }

  async createProduct(productData: Product): Promise<Product> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.beforeCreate(productData);

      const product = await queryRunner.manager.save(Product, productData);

      for (const classification of productData.productClassifications) {
        const { images, ...classificationFields } = classification;
        const classificationResponse = await queryRunner.manager.save(
          ProductClassification,
          {
            ...classificationFields,
            product,
          }
        );

        if (classification.images && classification.images.length > 0) {
          for (const image of classification.images) {
            await queryRunner.manager.save(ProductImage, {
              ...image,
              productClassification: classificationResponse,
            });
          }
        }
      }

      let images: ProductImage[] = [];
      if (productData.images && productData.images.length > 0) {
        const productImages = productData.images.map((image) => ({
          ...image,
          product,
        }));
        images = await queryRunner.manager.save(ProductImage, productImages);
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

  async updateProduct(
    productData: Partial<Product>,
    id: string
  ): Promise<Product> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.beforeUpdate(id, productData);
      const productRepository = queryRunner.manager.getRepository(Product);
      const productClassificationRepository = queryRunner.manager.getRepository(
        ProductClassification
      );
      const productDiscountRepository =
        queryRunner.manager.getRepository(ProductDiscount);
      const productImageRepository =
        queryRunner.manager.getRepository(ProductImage);

      const product = await productRepository.findOne({
        where: { id },
      });

      if (!product) {
        throw new Error("Product not found.");
      }

      if (
        productData.productClassifications &&
        productData.productClassifications.length > 0
        //    &&productData.productClassifications[0].type ===
        //     ClassificationTypeEnum.CUSTOM
      ) {
        //   await productClassificationRepository.delete({
        //     product: { id },
        //     type: ClassificationTypeEnum.DEFAULT,
        //   });

        for (const classification of productData.productClassifications) {
          const originalClassification =
            await productClassificationRepository.findOne({
              where: { id: classification.id },
            });

          const { images, ...classificationFields } = classification;
          let classificationResponse;
          if (classificationFields.id) {
            await productClassificationRepository.update(
              classificationFields.id,
              classificationFields
            );
            classificationResponse = classification;

            const productDiscounts = await productDiscountRepository.find({
              where: { product: { id } },
              relations: ["productClassifications"],
            });

            for (const discount of productDiscounts) {
              for (const discountClassification of discount.productClassifications) {
                if (
                  discountClassification.title ===
                    originalClassification.title &&
                  discountClassification.sku === originalClassification.sku
                ) {
                  const { quantity, id, ...discountUpdatableFields } =
                    classificationResponse;

                  await productClassificationRepository.update(
                    discountClassification.id,
                    discountUpdatableFields
                  );
                }
              }
            }
          } else {
            classificationResponse = await productClassificationRepository.save(
              {
                ...classificationFields,
                product,
              }
            );
          }

          if (classification.images && classification.images.length > 0) {
            for (const image of classification.images) {
              if (image.id) {
                await productImageRepository.update(image.id, image);
              } else {
                await productImageRepository.save({
                  ...image,
                  productClassification: classificationResponse,
                });
              }
            }
          }
        }
      }

      if (productData.images && productData.images.length > 0) {
        for (const image of productData.images) {
          if (image.id) {
            await productImageRepository.update(image.id, image);
          } else {
            await productImageRepository.save({
              ...image,
              product,
            });
          }
        }
      }

      const { productClassifications, images, ...productFields } = productData;
      await productRepository.update(id, productFields);

      await queryRunner.commitTransaction();

      const updatedProduct = await productRepository.findOne({
        where: { id },
        relations: ["productClassifications", "images"],
      });

      return updatedProduct!;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateProductStatus(
    productId: string,
    status: ProductEnum
  ): Promise<Product> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productRepository = queryRunner.manager.getRepository(Product);
      const preOrderProductRepository =
        queryRunner.manager.getRepository(PreOrderProduct);
      const productDiscountRepository =
        queryRunner.manager.getRepository(ProductDiscount);
      const product = await productRepository.findOne({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Product with id ${productId} not found`);
      }

      product.status = status;
      await productRepository.save(product);

      if (status === ProductEnum.INACTIVE || status === ProductEnum.BANNED) {
        await preOrderProductRepository.update(
          { product: { id: productId } },
          { status: PreOrderProductEnum.INACTIVE }
        );

        await productDiscountRepository.update(
          { product: { id: productId } },
          { status: ProductDiscountEnum.INACTIVE }
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

  async searchProductsName(searchKey: string): Promise<string[]> {
    const products = await repository.find({
      where: {
        name: ILike(`%${searchKey}%`),
      },
      select: ["name"],
    });

    return products.map((product) => product.name);
  }
}
export const productService = new ProductService();
