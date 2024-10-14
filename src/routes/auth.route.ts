import express from "express";
import { authController } from "../controller/auth.controller";
const authRoute = express.Router();
authRoute.post("/login", authController.login);
authRoute.post("/refresh", authController.refreshToken);
export default authRoute;
