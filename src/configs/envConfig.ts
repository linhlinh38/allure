import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT as unknown as number | undefined;

//Database
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT as unknown as number | undefined;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

//JWT Token
const SECRET_KEY_FOR_ACCESS_TOKEN = process.env.SECRET_KEY_FOR_ACCESS_TOKEN;
const SECRET_KEY_FOR_REFRESH_TOKEN = process.env.SECRET_KEY_FOR_REFRESH_TOKEN;

//Google Login Credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

export const config = {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  PORT,
  SECRET_KEY_FOR_ACCESS_TOKEN,
  SECRET_KEY_FOR_REFRESH_TOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
};
