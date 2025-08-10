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
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAllEvents)
    .post(protect, admin, upload.single('image') ,validate(createEventSchema), createEvent);


router.route('/:id')
    .get(getEventById)
    .put(protect, admin, upload.single('image'), updateEvent)
    .delete(protect, admin, deleteEvent);

export default router;