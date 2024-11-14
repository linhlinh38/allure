import { DataSource, QueryRunner, Repository } from "typeorm";
import { Account } from "../entities/account.entity";
import { BaseService } from "./base.service";
import { AppDataSource } from "../dataSource";
import { BadRequestError, EmailAlreadyExistError } from "../errors/error";
import { encryptedPassword } from "../utils/jwt";
import { RoleEnum, StatusEnum } from "../utils/enum";
import {
  sendRegisterAccountEmail,
  sendResetPasswordEmail,
} from "./mail.service";
import { Address } from "../entities/address.entity";
import { File } from "../entities/file.entity";
import { roleService } from "./role.service";
const repository = AppDataSource.getRepository(Account);
class AccountService extends BaseService<Account> {
  constructor() {
    super(repository);
  }

  async getById(accountId: string) {
    const account = await repository.findOne({
      where: { id: accountId },
      relations: ["role"],
    });

    if (!account) {
      throw new Error("Account not found");
    }
    return {
      ...account,
      role: account.role.role,
    };
  }

  async getBy(value: any, option: string) {
    const accounts = repository.find({
      where: {
        [option]: value,
      },
      relations: ["role"],
    });

    return (await accounts).map((account) => ({
      ...account,
      role: account.role ? account.role.role : null,
    }));
  }

  async createAccount(accountData: Partial<Account>): Promise<Account> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const checkEmail = await accountService.findBy(
        accountData.email,
        "email"
      );
      if (checkEmail.length !== 0) {
        throw new EmailAlreadyExistError("Email already exists!");
      }

      if (accountData.password) {
        accountData.password = await encryptedPassword(accountData.password);
      }

      accountData.status = StatusEnum.PENDING;
      const createdAccount = await queryRunner.manager.save(
        Account,
        accountData
      );

      await this.insertRelatedEntityBasedOnRole(
        queryRunner,
        createdAccount,
        accountData
      );

      await queryRunner.commitTransaction();

      return createdAccount;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async insertRelatedEntityBasedOnRole(
    queryRunner: QueryRunner,
    account: Account,
    data: any
  ) {
    if (data.avatar) {
      const avatar: Partial<File> = {
        account: account,
        name: data.avatar.name,
        fileUrl: data.avatar.fileUrl,
        type: data.avatar.type,
      };
      await queryRunner.manager.save(File, avatar);
    }

    if (
      data.role !== RoleEnum.CONSULTANT &&
      data.role !== RoleEnum.KOL &&
      data.certificate
    ) {
      throw new BadRequestError(
        "Certificate is only available for role CONSULTANT and KOL"
      );
    }

    const role = await roleService.findById(account.role);
    switch (role.role) {
      case RoleEnum.CUSTOMER:
        if (data.address) {
          const address: Partial<Address> = {
            account: account,
            number: data.address.number,
            building: data.address.building,
            street: data.address.street,
            ward: data.address.ward,
            city: data.address.city,
            province: data.address.province,
            fullAddress: data.address.fullAddress,
            type: data.address.type,
          };
          await queryRunner.manager.save(Address, address);
        }
        await sendRegisterAccountEmail(account);
        break;
      case RoleEnum.MANAGER:
        await sendRegisterAccountEmail(account);
        break;
      case RoleEnum.STAFF:
        await sendResetPasswordEmail(account);
        break;
      case RoleEnum.CONSULTANT:
        if (data.certificate) {
          const certConsultant: Partial<File> = {
            account: account,
            name: data.certificate.name,
            fileUrl: data.certificate.fileUrl,
            type: data.certificate.type,
          };
          await queryRunner.manager.save(File, certConsultant);
        }

        await sendRegisterAccountEmail(account);
        break;
      case RoleEnum.KOL:
        if (data.certificate) {
          const certKOL: Partial<File> = {
            account: account,
            name: data.certificate.name,
            fileUrl: data.certificate.fileUrl,
            type: data.certificatel.type,
          };
          await queryRunner.manager.save(File, certKOL);
        }
        await sendResetPasswordEmail(account);
        break;
      case RoleEnum.OPERATION:
        await sendResetPasswordEmail(account);
        break;
      default:
        throw new Error("Invalid role provided");
    }
  }
}

export const accountService = new AccountService();
