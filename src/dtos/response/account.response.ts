import { GenderEnum, RoleEnum, StatusEnum } from "../../utils/enum";
import { Exclude } from "class-transformer";

export class AccountResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: RoleEnum;
  gender?: GenderEnum;
  phone?: string;
  dob?: Date;
  avatar?: string;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;

  @Exclude()
  password?: string;
}