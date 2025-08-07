import z, { email } from "zod";

export const registerSchema = z.object({
    body: z.object({
        firstName: z
        .string({ required_error: 'First name is required'})
        .min(2, 'First name must be at least 2 character long'),
        
        lastName: z
        .string({ required_error: 'Last name is required'})
        .min(2, 'Last name must be at least 2 character long'),
        
        email: z
        .string({ required_error: 'Email is required'})
        .min(2, 'Please provide a valid email address'),

        password: z
        .string({ required_error: 'Password is required'})
        .min(2, 'Password must be atleast 8 characters long')
        .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
    })
});


export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email address'),

    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});