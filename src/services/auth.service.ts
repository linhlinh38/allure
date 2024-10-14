import { config } from "../config/envConfig";
import { AppDataSource } from "../dataSource";
import { Account } from "../entities/account.entity";
import { BadRequestError } from "../errors/error";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateRefreshToken } from "../utils/jwt";

const repository = AppDataSource.getRepository(Account);

export async function login(email: string, password: string) {
  const account = await repository.findOneBy({ email });
  if (!account) {
    throw new BadRequestError("Invalid email");
  }

  if (account.password.length > 0) {
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new BadRequestError("Invalid password");
    }
  } else {
    throw new BadRequestError("User must login by google");
  }

  const payload = { accountId: account.id.toString() };
  const token = jwt.sign(payload, config.SECRET_KEY_FOR_ACCESS_TOKEN, {
    expiresIn: "1d",
  });
  const refreshToken = generateRefreshToken(account.id.toString());

  return { token, refreshToken };
}
