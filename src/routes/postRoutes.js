import { Router } from "express";
import * as postController from "../controllers/postController.js";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// publics
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);

// protected
router.post("/", authMiddleware, postController.create);
router.put("/:id", authMiddleware, postController.update);
router.delete("/:id", authMiddleware, postController.remove);

// admin only
router.get("/admin/all", authMiddleware, requireAdmin, postController.getPostsAdmin);

export default router;
