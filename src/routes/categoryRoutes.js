import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.remove);

export default router;