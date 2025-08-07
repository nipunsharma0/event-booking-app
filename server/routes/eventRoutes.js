import express from 'express';
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';

import { protect, admin } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { createEventSchema } from '../schemas/eventSchema.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllEvents)
    .post(protect, admin, validate(createEventSchema), createEvent);


router.route('/:id')
    .get(protect, getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

export default router;