import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { auth } from '../middlewares/auth.js';

const authRoutes = express.Router();

authRoutes.use(express.json());

authRoutes.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

authRoutes.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

authRoutes.post('/logout', auth, ctrlWrapper(logoutController));
authRoutes.post('/refresh', auth, ctrlWrapper(refreshController));

export default authRoutes;
