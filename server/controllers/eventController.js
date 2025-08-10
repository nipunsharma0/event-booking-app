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

  if (req.file) {
    event.image = req.file.path;
  }
  const createdEvent = await event.save();
  res.status(201).json({ message: "Event created successfully!", createdEvent });
});


// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getAllEvents = asyncHandler(async (req, res) => {

  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const filter = {};

  if (req.query.keyword) {
    filter.name = { $regex: req.query.keyword, $options: 'i'}
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.city) {
    filter['venue.city'] = { $regex: req.query.city, $options: 'i' } // To handle case-sensitivity
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) {
      filter.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filter.price.$lte = Number(req.query.maxPrice);
    }
  }


  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) {
      filter.date.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      endDate.setUTCHours(23, 59, 59, 999);
      filter.date.$lte = endDate;
    }
  }

  const count = await Event.countDocuments(filter);

  const events = await Event.find(filter)
    .populate('organizer', 'firstName lastName')
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.status(200).json({ events , page, pages: Math.ceil(count / pageSize)});
});


// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = asyncHandler(async (req, res) => {

  const event = await Event.findById(req.params.id);
  console.log(req.params._id);

  if (event) {
    res.status(200).json({ message: "Event fetched successfully", event })
  } else {
    res.status(404).json({ message: "Event not found" })
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

    if (req.file) {
      event.image = req.file.path;
    }

    const updatedEvent = await event.save();
    res.status(200).json({ message: "Event updated successfully!" });
  } else {
    res.status(404).json({ message: "Event not found" });
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
    res.status(200).json({ message: 'Event deleted successfully' });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

