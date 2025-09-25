import { z } from 'zod';

// Property validation schema
export const propertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Property name is required' })
    .max(200, { message: 'Property name must be less than 200 characters' }),
  address: z
    .string()
    .trim()
    .min(1, { message: 'Address is required' })
    .max(500, { message: 'Address must be less than 500 characters' }),
  description: z
    .string()
    .trim()
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional(),
  totalUnits: z
    .number()
    .min(1, { message: 'Total units must be at least 1' })
    .max(10000, { message: 'Total units must be less than 10,000' }),
  caretakerId: z
    .string()
    .optional(),
});

// Unit validation schema
export const unitSchema = z.object({
  propertyId: z
    .string()
    .min(1, { message: 'Property is required' }),
  unitNumber: z
    .string()
    .trim()
    .min(1, { message: 'Unit number is required' })
    .max(50, { message: 'Unit number must be less than 50 characters' }),
  bedrooms: z
    .number()
    .min(0, { message: 'Bedrooms cannot be negative' })
    .max(20, { message: 'Bedrooms must be less than 20' }),
  bathrooms: z
    .number()
    .min(0, { message: 'Bathrooms cannot be negative' })
    .max(20, { message: 'Bathrooms must be less than 20' }),
  rent: z
    .number()
    .min(0, { message: 'Rent cannot be negative' })
    .max(100000, { message: 'Rent must be less than $100,000' }),
  deposit: z
    .number()
    .min(0, { message: 'Deposit cannot be negative' })
    .max(100000, { message: 'Deposit must be less than $100,000' }),
  squareFootage: z
    .number()
    .min(0, { message: 'Square footage cannot be negative' })
    .max(50000, { message: 'Square footage must be less than 50,000' })
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional(),
});

// Tenant validation schema
export const tenantSchema = z.object({
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
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' })
    .max(254, { message: 'Email must be less than 254 characters' }),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]{10,}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
export type UnitFormData = z.infer<typeof unitSchema>;
export type TenantFormData = z.infer<typeof tenantSchema>;