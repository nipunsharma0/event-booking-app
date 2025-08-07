import asyncHandler from "express-async-handler";
import Event from "../models/Event.js";


// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = asyncHandler(async (req, res) => {

    const eventData = req.body;

    const event = new Event({
        ...eventData,
        organizer: req.user._id, // this will link event to current admin
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
});


// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = asyncHandler(async (req, res) => {

    const events = await Event.find({}).populate('organizer', 'firstName lastName');
    res.status(200).json(events);
});


// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {

    const event = await Event.findById(req.params.id);
    console.log(req.params._id);
    
    if(event) {
        res.status(200).json(event)
    } else {
        res.status(404).json({ message: "Event not found"})
    }
});


// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    event.name = req.body.name || event.name;
    event.description = req.body.description || event.description;
    event.category = req.body.category || event.category;
    event.date = req.body.date || event.date;
    event.venue = req.body.venue || event.venue;
    event.price = req.body.price || event.price;
    event.maxSeats = req.body.maxSeats || event.maxSeats;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } else {
    res.status(404).json({ message: "Event not found"});
    throw new Error('Event not found');
  }
});


// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await Event.deleteOne({ _id: event._id });
    res.status(200).json({ message: 'Event removed' });
  } else {
    res.status(404).json({ message: "Event not found"});
  }
});

