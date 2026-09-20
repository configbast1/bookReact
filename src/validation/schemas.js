import { z } from 'zod';
import { message } from './messages.js';

const PHONE_PATTERN = /^\+?38?0\d{9}$/;
const PASSWORD_PATTERN = /^(?=.*[a-zA-Zа-яА-ЯіїєІЇЄ])(?=.*\d).{6,}$/;
const CURRENT_YEAR = new Date().getFullYear();

const requiredText = (min = 2, max = 120) =>
  z
    .string({ required_error: message('validation.required') })
    .trim()
    .min(1, message('validation.required'))
    .min(min, message('validation.minLength', { count: min }))
    .max(max, message('validation.maxLength', { count: max }));

const email = z
  .string({ required_error: message('validation.required') })
  .trim()
  .min(1, message('validation.required'))
  .email(message('validation.email'));

const password = z
  .string({ required_error: message('validation.required') })
  .min(1, message('validation.required'))
  .regex(PASSWORD_PATTERN, message('validation.password'));

const numeric = (min, max) =>
  z.coerce
    .number({ invalid_type_error: message('validation.number') })
    .min(min, message('validation.min', { value: min }))
    .max(max, message('validation.max', { value: max }));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, message('validation.required')),
});

export const registerSchema = z.object({
  name: requiredText(2, 60),
  email,
  password,
});

export const profileSchema = z.object({
  name: requiredText(2, 60),
  email,
  phone: z
    .string()
    .trim()
    .min(1, message('validation.required'))
    .regex(PHONE_PATTERN, message('validation.phone')),
  address: z.string().trim().max(160, message('validation.maxLength', { count: 160 })).optional(),
});

export const checkoutSchema = z.object({
  name: requiredText(2, 60),
  email,
  phone: z
    .string()
    .trim()
    .min(1, message('validation.required'))
    .regex(PHONE_PATTERN, message('validation.phone')),
  city: requiredText(2, 60),
  address: requiredText(3, 160),
  delivery: z.enum(['nova', 'courier', 'pickup']),
  payment: z.enum(['card', 'cod', 'cash'], {
    errorMap: () => ({ message: message('validation.required') }),
  }),
  comment: z.string().trim().max(400, message('validation.maxLength', { count: 400 })).optional(),
});

export const bookSchema = z.object({
  title: requiredText(2, 120),
  author: requiredText(3, 80),
  genre: z.string().min(1, message('validation.required')),
  format: z.enum(['paper', 'ebook', 'audio']),
  price: numeric(1, 100000),
  year: numeric(-3000, CURRENT_YEAR + 1),
  stock: numeric(0, 100000),
  pages: numeric(0, 10000),
  isbn: z.string().trim().max(20, message('validation.maxLength', { count: 20 })).optional(),
  rating: numeric(0, 5),
  description: z.string().trim().max(600, message('validation.maxLength', { count: 600 })).optional(),
  cover: z.enum(['soft', 'hard']).optional(),
  fileFormat: z.enum(['pdf', 'epub', 'fb2']).optional(),
  narrator: z.string().trim().max(80, message('validation.maxLength', { count: 80 })).optional(),
  durationMin: numeric(0, 10000).optional(),
});

export const quickBookSchema = z.object({
  title: requiredText(2, 120),
  author: requiredText(3, 80),
  genre: z.string().min(1, message('validation.required')),
  format: z.enum(['paper', 'ebook', 'audio']),
  price: numeric(1, 100000),
  year: numeric(-3000, CURRENT_YEAR + 1),
});

export const reviewSchema = z.object({
  author: requiredText(2, 40),
  rating: numeric(1, 5),
  text: requiredText(5, 400),
});

export const YEAR_BOUNDS = { min: -3000, max: CURRENT_YEAR + 1 };
