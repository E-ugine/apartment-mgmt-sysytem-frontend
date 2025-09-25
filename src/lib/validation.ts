import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(150, { message: 'Username must be less than 150 characters' })
    .regex(/^[a-zA-Z0-9_@+.-]+$/, { 
      message: 'Username can only contain letters, numbers, and @/+/-/./_ characters' 
    }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});

// Registration validation schema
export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(150, { message: 'Username must be less than 150 characters' })
    .regex(/^[a-zA-Z0-9_@+.-]+$/, { 
      message: 'Username can only contain letters, numbers, and @/+/-/./_ characters' 
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(254, { message: 'Email must be less than 254 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }),
  confirmPassword: z.string(),
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(100, { message: 'First name must be less than 100 characters' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .max(100, { message: 'Last name must be less than 100 characters' }),
  role: z.enum(['landlord', 'caretaker', 'tenant', 'agent'], {
    required_error: 'Please select a role',
  }),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]{10,}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;