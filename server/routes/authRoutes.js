import express from 'express';
import { registerUser, loginUser, logoutUser, verifyEmail } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/verifyemail/:token', verifyEmail);

export default router;