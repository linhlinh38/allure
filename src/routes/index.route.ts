import express from 'express';
import accountRouter from './account.route';
import authRoute from './auth.route';
import brandRoute from './brand.route';

const router = express.Router();
router.use('/accounts', accountRouter);
router.use('/auth', authRoute);
router.use('/brands', brandRoute);
export default router;
