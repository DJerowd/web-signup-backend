import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  registerValidationRules,
  loginValidationRules,
  validate,
} from '../middlewares/validators/authValidator.js';

const router = Router();

// --- Rotas Públicas (não precisam de token) ---
router.post('/register', registerValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);

// --- Rotas Privadas (precisam de token) ---
router.get("/profile", authMiddleware, getProfile);

export default router;
