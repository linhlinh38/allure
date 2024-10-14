import express from "express";
import accountRouter from "./account.route";
import authRoute from "./auth.route";

const router = express.Router();
router.use("/account", accountRouter);
router.use("/auth", authRoute);
export default router;
