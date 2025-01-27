import express from "express";
import { authController } from "../controllers/auth.controller";
const authRoute = express.Router();
authRoute.post("/login", authController.login);
authRoute.get("/google/callback", authController.loginGoogle);
authRoute.post("/refresh-token", authController.refreshToken);
export default authRoute;
