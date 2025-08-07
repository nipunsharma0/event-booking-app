import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { loginSchema, registerSchema } from '../schemas/authSchema.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);


export default router;