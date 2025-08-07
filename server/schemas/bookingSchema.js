import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    eventId: z
      .string({ required_error: 'Event ID is required' })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID format'),

    seatsBooked: z
      .number({ required_error: 'Number of seats is required' })
      .int()
      .positive('You must book at least one seat'),
  }),
});