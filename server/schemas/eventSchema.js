import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Event name is required' })
      .min(3, 'Event name must be at least 3 characters long'),
      
    description: z
      .string({ required_error: 'Description is required' })
      .min(10, 'Description must be at least 10 characters long'),

    category: z.enum(
      ['Music', 'Sports', 'Technology', 'Arts', 'Food & Drink', 'Other'],
      { required_error: 'Category is required' }
    ),

    // Coerce converts string to Date
    date: z.coerce.date({ required_error: 'Event date is required' }), 

    venue: z.object({
      street: z.string({ required_error: 'Street is required' }),
      city: z.string({ required_error: 'City is required' }),
      state: z.string({ required_error: 'State is required' }),
      zipCode: z.string({ required_error: 'Zip code is required' }),
    }),

    price: z
      .number({ required_error: 'Price is required' })
      .min(0, 'Price cannot be negative'),
      
    maxSeats: z
      .number({ required_error: 'Max seats is required' })
      .positive('Max seats must be a positive number'),
  }),
});