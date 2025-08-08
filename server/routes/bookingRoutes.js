import express from 'express';
import { createBooking, getMyBookings, getAllBookings, getUserBookings, getBookingsStats } from '../controllers/bookingController.js';
import { protect , admin} from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createBookingSchema } from '../schemas/bookingSchema.js';


const router = express.Router();

// User routes
router.route('/').post(protect, validate(createBookingSchema) ,createBooking);
router.route('/mybookings').get(protect, getMyBookings);

// Admin routes
router.route('/').get(protect, admin, getAllBookings);
router.route('/user/:id').get(protect, admin, getUserBookings);
router.route('/stats').get(protect, admin, getBookingsStats);

export default router;