import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
// router.post('/token', authController.getNewToken);

export default router;