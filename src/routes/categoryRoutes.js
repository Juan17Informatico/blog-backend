import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// publics
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

// protected
router.post("/", authMiddleware, categoryController.create);
router.put("/:id", authMiddleware, categoryController.update);
router.delete("/:id", authMiddleware, categoryController.remove);

export default router;