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
    .get(getAllEvents)
    .post(protect, admin, validate(createEventSchema), createEvent);


router.route('/:id')
    .get(getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

export default router;