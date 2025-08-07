import express from 'express';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createBookingSchema } from '../schemas/bookingSchema.js';


const router = express.Router();

router.route('/').post(protect, validate(createBookingSchema) ,createBooking);

router.route('/mybookings').get(protect, getMyBookings);

export default router;