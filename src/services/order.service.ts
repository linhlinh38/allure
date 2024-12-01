import { LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
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

const repository = AppDataSource.getRepository(Order);
class OrderService extends BaseService<Order> {
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
      // init parent order
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
      }
      //validate shop vouchers
      orderNormalBody.orders.forEach(async (order) => {
        if (order.shopVoucherId) {
          await voucherService.validateShopVoucher(order.shopVoucherId, accountId);
        }
      });
      orderNormalBody.orders.forEach(async (order) => {
        let shopVoucher: Voucher = null;
        if (order.shopVoucherId) {
          shopVoucher = await voucherRepository.findOne({
            where: { id: order.shopVoucherId },
            relations: ['brand']
          });
        }
        //create shop order
        const childOrder: Order = new Order();
        Object.assign(childOrder, orderNormalBody);
        childOrder.orderDetails = [];
        childOrder.account = account;
        order.items.forEach(async (item) => {
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
            price = price * productDiscountEvent.discount;
            orderDetail.productDiscount = productDiscountEvent;
          }
          orderDetail.price = price;
          orderDetail.quantity = item.quantity;
          orderDetail.totalPriceAfterDiscount = price;
          orderDetail.productClassification = productClassification;
          //update quantity of product classification
          productClassification.quantity -= item.quantity;
          await queryRunner.manager.save(
            ProductClassification,
            productClassification
          );
          //push order detail into child order
          childOrder.orderDetails.push(orderDetail);
        });
        if (shopVoucher) {
          voucherService.calculateApplyVoucher(shopVoucher, childOrder);
          childOrder.vouchers = [shopVoucher];
        }
        //push child order into parent order
        parentOrder.children.push(childOrder);
      });
      if (platformVoucher) {
        voucherService.calculateApplyVoucher(platformVoucher, parentOrder);
        parentOrder.vouchers = [platformVoucher];
      }

      await queryRunner.manager.save(Order, parentOrder);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('go to error');
      
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
