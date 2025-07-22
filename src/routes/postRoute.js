import { Router } from 'express';
import { getAllPosts, getPostBySlug } from '../controllers/postController.js';

const router = Router();

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

export default router;
