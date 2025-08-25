import { Router } from "express";
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { validate } from "../middlewares/validators/authValidator.js";
import { updateUserValidationRules } from "../middlewares/validators/userValidator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", adminMiddleware, listUsers);
router.get("/:id", adminMiddleware, getUserById);
router.put("/:id", updateUserValidationRules(), validate, updateUser);
router.delete("/:id", deleteUser);

export default router;
