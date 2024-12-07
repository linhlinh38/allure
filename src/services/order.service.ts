import {
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Or,
} from 'typeorm';
import { AppDataSource } from '../dataSource';
import { BadRequestError } from '../errors/error';
import { BaseService } from './base.service';
import { Order } from '../entities/order.entity';
import { OrderNormalRequest } from '../dtos/request/order.request';
import { voucherRepository } from '../repositories/voucher.repository';
import { productClassificationRepository } from '../repositories/productClassification.repository';
import { productDiscountRepository } from '../repositories/productDiscount.repository';
import { Voucher } from '../entities/voucher.entity';
import { voucherService } from './voucher.service';
import { OrderDetail } from '../entities/orderDetail.entity';
import { ProductClassification } from '../entities/productClassification.entity';
import { accountRepository } from '../repositories/account.repository';
import { brandRepository } from '../repositories/brand.repository';
import { ShippingStatusEnum } from '../utils/enum';

const repository = AppDataSource.getRepository(Order);
class OrderService extends BaseService<Order> {
  async getMyOrders(
    search: string,
    status: ShippingStatusEnum,
    loginUser: string
  ) {
    const commonConditions = {
      relations: {
        account: true,
        children: {
          orderDetails: {
            productClassification: true,
            productClassificationPreOrder: true,
          },
          voucher: true,
        },
        brand: true
      },
      where: [
        {
          account: { id: loginUser },
          parent: Not(IsNull()),
        },
      ],
      order: {
        createdAt: { direction: 'DESC' as const },
      },
    };
    // if searh is null or empty, get all my order
    if (!search) {
      return await repository.find({
        ...commonConditions,
      });
    }
    // if status is not empty, get my orders by status
    if (status) {
      return await repository.find({
        ...commonConditions,
        where: [
          ...commonConditions.where,
          {
            status: status,
          },
        ],
      });
    }
    // else, get my orders by order Id, product name, brand name
    const keywords = search.split(' ');
    const searchConditions = keywords.flatMap((keyword) => [
      // Tìm theo product name
      {
        orderDetails: {
          productClassification: {
            product: { name: Like(`%${keyword}%`) },
          },
        },
      },
      // Tìm theo productClassificationPreOrder
      {
        orderDetails: {
          productClassificationPreOrder: {
            product: { name: Like(`%${keyword}%`) },
          },
        },
      },
      // Tìm theo brand name
      {
        children: {
          orderDetails: {
            productClassification: {
              product: { brand: { name: Like(`%${keyword}%`) } },
            },
          },
        },
      },
      {
        id: Like(`%${keyword}%`),
      },
    ]);
    return await repository.find({
      ...commonConditions,
      where: {
        ...commonConditions.where,
        ...searchConditions,
      },
    });
  }
  async getByBrand(brandId: string) {
    const brand = await brandRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) throw new BadRequestError('Brand not found');

    const orders = await repository.find({
      relations: {
        account: true,
        orderDetails: {
          productClassification: { product: true },
          productClassificationPreOrder: { product: true },
        },
        voucher: true,
      },
      where: [
        {
          parent: Not(IsNull()),
          orderDetails: {
            productClassification: {
              product: {
                brand: { id: brandId },
              },
            },
          },
        },
        {
          parent: Not(IsNull()),
          orderDetails: {
            productClassificationPreOrder: {
              product: {
                brand: { id: brandId },
              },
            },
          },
        },
      ],
      order: {
        createdAt: 'DESC',
      },
    });
    return orders;
  }

  async getAllTotalOrders() {
    const orders = await repository.find({
      relations: {
        account: true,
        children: {
          orderDetails: {
            productClassification: true,
            productClassificationPreOrder: true,
          },
          voucher: true,
        },
      },
      where: {
        parent: IsNull(),
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return orders;
  }
  async createNormal(orderNormalBody: OrderNormalRequest, accountId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await accountRepository.findOne({
        where: { id: accountId },
      });
      const now = new Date();
      let platformVoucher: Voucher = null;
      //init parent order
      const parentOrder: Order = new Order();
      Object.assign(parentOrder, orderNormalBody);
      parentOrder.children = [];
      parentOrder.account = account;

      //validate platform voucher
      if (orderNormalBody.platformVoucherId) {
        platformVoucher = await voucherRepository.findOne({
          where: { id: orderNormalBody.platformVoucherId },
          relations: { brand: true },
        });
        await voucherService.validatePlatformVoucher(
          orderNormalBody.platformVoucherId,
          accountId
        );
        parentOrder.voucher = platformVoucher;
      }
      //validate shop vouchers
      for (const order of orderNormalBody.orders) {
        if (order.shopVoucherId) {
          await voucherService.validateShopVoucher(
            order.shopVoucherId,
            accountId
          );
        }
      }
      for (const order of orderNormalBody.orders) {
        //create shop order
        const childOrder: Order = new Order();
        Object.assign(childOrder, orderNormalBody);
        childOrder.orderDetails = [];
        childOrder.account = account;

        let shopVoucher: Voucher = null;
        if (order.shopVoucherId) {
          shopVoucher = await voucherRepository.findOne({
            where: { id: order.shopVoucherId },
            relations: ['brand'],
          });
          childOrder.voucher = shopVoucher;
        }
        for (const item of order.items) {
          //find product
          const productClassification =
            await productClassificationRepository.findOne({
              where: { id: item.productClassificationId },
              relations: { product: true },
            });
          if (!productClassification)
            throw new BadRequestError('Product not found');
          if (item.quantity > productClassification.quantity) {
            throw new BadRequestError('Product is out of stock');
          }
          let price = productClassification.price;
          //create order detail
          const orderDetail = new OrderDetail();
          //check product discount event
          const productDiscountEvent = await productDiscountRepository.findOne({
            where: {
              product: { id: productClassification.product.id }, // Lọc theo productId
              startTime: LessThanOrEqual(now.toISOString()), // startTime <= now
              endTime: MoreThanOrEqual(now.toISOString()), // endTime >= now
            },
          });
          if (productDiscountEvent) {
            price = Math.round(price * productDiscountEvent.discount);
            orderDetail.productDiscount = productDiscountEvent;
          }
          orderDetail.subTotal = price;
          orderDetail.quantity = item.quantity;
          orderDetail.totalPrice = price;
          orderDetail.productClassification = productClassification;
          //update quantity of product classification
          productClassification.quantity -= item.quantity;
          await queryRunner.manager.save(
            ProductClassification,
            productClassification
          );
          //push order detail into child order
          childOrder.orderDetails.push(orderDetail);
        }
        if (shopVoucher) {
          voucherService.applyShopVoucher(childOrder);
          childOrder.voucher = shopVoucher;
        }
        //push child order into parent order
        parentOrder.children.push(childOrder);
      }
      if (platformVoucher) {
        voucherService.applyPlatformVoucher(parentOrder);
        parentOrder.voucher = platformVoucher;
      }

      voucherService.calculateOrderPrice(parentOrder);

      await queryRunner.manager.save(Order, parentOrder);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  constructor() {
    super(repository);
  }
}

export const orderService = new OrderService();
