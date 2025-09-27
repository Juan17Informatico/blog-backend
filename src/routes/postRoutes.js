import { Router } from "express";
import * as postController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// publics
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);

// protected
router.post("/", authMiddleware,  postController.create);
router.put("/:id", authMiddleware, postController.update);
router.delete("/:id", authMiddleware, postController.remove);

export default router;
