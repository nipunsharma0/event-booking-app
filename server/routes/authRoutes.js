import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { registerSchema } from '../schemas/authSchema.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);

export default router;