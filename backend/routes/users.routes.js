import { Router } from 'express';
import { login, signup } from '../controllers/User.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
