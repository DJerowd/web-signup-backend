import { Router } from "express";
import {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  registerValidationRules,
  loginValidationRules,
  validate,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
} from "../middlewares/validators/authValidator.js";
import loginLimiter from "../middlewares/rateLimitMiddleware.js";

const router = Router();

// --- Rotas Públicas (não precisam de token) ---
router.post("/register", registerValidationRules(), validate, register);
router.post("/login", loginLimiter, loginValidationRules(), validate, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post('/forgot-password', forgotPasswordValidationRules(), validate, forgotPassword);
router.post('/reset-password/:resetToken', resetPasswordValidationRules(), validate, resetPassword);

// --- Rotas Privadas (precisam de token) ---
router.get("/profile", authMiddleware, getProfile);

export default router;
