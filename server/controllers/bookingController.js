import asyncHandler from "express-async-handler";
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { protect } from "../middlewares/authMiddleware.js";


// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {

    const { eventId, seatsBooked } = req.body;

    const event = await Event.findById(eventId);

    if (!eventId) {
        res.status(404).json({ message: "Invalid event Id" })
    }

    const availableSeats = event.maxSeats - event.bookedSeats;
    if (seatsBooked > availableSeats) {
        res.status(400).json({ message: `Only ${availableSeats} seats are remaining` })
    }

    const booking = await Booking.create({
        event: eventId,
        user: req.user._id,
        seatsBooked,
        totalPrice: event.price * seatsBooked
    })

    event.bookedSeats += seatsBooked;
    await event.save();

    res.status(201).json({ message: "Booking created successfully!" , booking });
})


// @desc    Get bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({ user: req.user._id })
        .populate('event', 'name date category price image venue');

    if (bookings && bookings.length > 0) {
        res.status(200).json({ message: "Bookings fetched successfully!" , bookings });
    } else {
        res.status(404).json({ message: "You have no bookings yet" });
    }

})


// @desc    Get all bookings for all users 
// @route   GET /api/bookings
// @access  Admin
export const getAllBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({})
        .populate('user', 'firstName lastName email')
        .populate('event', 'name');

    res.status(200).json({ message: "All bookings fetched successfully", bookings});
});


// @desc    Get all bookings for a specific users 
// @route   GET /api/bookings/user/:id
// @access  Admin
export const getUserBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({ user: req.params.id})
        .populate('event', 'name date category price');

    if (bookings && bookings.length > 0) {
        res.status(200).json({bookings});
        return;
    } else {
        res.status(404).json({ message: "No bookings found for this user" })
    }

    res.status(200).json({ message: "All bookings fetched successfully", bookings});
});


// @desc    Get booking stats
// @route   GET /api/bookings/stats
// @access  Admin
export const getBookingsStats = asyncHandler(async (req, res) => {

    const stats = await Booking.aggregate([

        {
            $group: {
                _id: '$event',
                totalBookings: { $sum: 1 },
                totalSeatsSold: { $sum: '$seatsBooked' },
                totalRevenue: { $sum: '$totalPrice' },
            }
        },

        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: '_id',
                as: 'eventDetails'
            }
        },

        {
            $project: {
                _id: 0,
                eventId: '$_id',
                eventName: { $arrayElemAt: ['$eventDetails.name', 0] },
                totalBookings: 1,
                totalSeatsSold: 1,
                totalRevenue: 1
            }
        }
    ]);

    res.status(200).json({stats});
})