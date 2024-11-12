import express from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  requestResetEmailController,
  resetPasswordController,
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from "../validation/auth.js";
import { auth } from "../middlewares/auth.js";

const authRoutes = express.Router();
const jsonParser = express.json({
  type: "application/json",
});

authRoutes.use(express.json());

authRoutes.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(registerController)
);

authRoutes.post(
  "/login",
  validateBody(loginSchema),
  ctrlWrapper(loginController)
);

authRoutes.post("/logout", ctrlWrapper(logoutController));
authRoutes.post("/refresh", ctrlWrapper(refreshController));

authRoutes.post(
  "/send-reset-email",
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController)
);

authRoutes.post(
  "/reset-pwd",
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

export default authRoutes;
