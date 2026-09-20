import * as yup from 'yup';
import { message } from './messages.js';

const CURRENT_YEAR = new Date().getFullYear();

export const quickBookYupSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required(message('validation.required'))
    .min(2, message('validation.minLength', { count: 2 }))
    .max(120, message('validation.maxLength', { count: 120 })),
  author: yup
    .string()
    .trim()
    .required(message('validation.required'))
    .min(3, message('validation.minLength', { count: 3 })),
  genre: yup.string().required(message('validation.required')),
  format: yup.string().oneOf(['paper', 'ebook', 'audio']).required(message('validation.required')),
  price: yup
    .number()
    .typeError(message('validation.number'))
    .required(message('validation.required'))
    .min(1, message('validation.min', { value: 1 })),
  year: yup
    .number()
    .typeError(message('validation.number'))
    .required(message('validation.required'))
    .min(-3000, message('validation.min', { value: -3000 }))
    .max(CURRENT_YEAR + 1, message('validation.max', { value: CURRENT_YEAR + 1 })),
});

export default quickBookYupSchema;
