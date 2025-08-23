import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// --- Rotas Públicas (não precisam de token) ---
router.post("/register", register);
router.post("/login", login);

// --- Rotas Privadas (precisam de token) ---
router.get("/profile", authMiddleware, getProfile);

export default router;
