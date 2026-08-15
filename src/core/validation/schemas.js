import ValidationSchema from './ValidationSchema.js';
import {
  RequiredValidator,
  MinLengthValidator,
  MaxLengthValidator,
  EmailValidator,
  PhoneValidator,
  NumberRangeValidator,
  PasswordValidator,
} from './rules.js';

/** Схема формы оформления заказа. */
export const checkoutSchema = new ValidationSchema({
  name: [new RequiredValidator("Вкажіть імʼя"), new MinLengthValidator(2), new MaxLengthValidator(60)],
  email: [new RequiredValidator('Вкажіть email'), new EmailValidator()],
  phone: [new RequiredValidator('Вкажіть телефон'), new PhoneValidator()],
  city: [new RequiredValidator('Вкажіть місто'), new MinLengthValidator(2)],
  address: [new RequiredValidator('Вкажіть адресу або відділення'), new MinLengthValidator(5)],
  payment: [new RequiredValidator('Оберіть спосіб оплати')],
  comment: [new MaxLengthValidator(300)],
});

/** Схема входа. */
export const loginSchema = new ValidationSchema({
  email: [new RequiredValidator('Вкажіть email'), new EmailValidator()],
  password: [new RequiredValidator('Вкажіть пароль'), new MinLengthValidator(4)],
});

/** Схема регистрации. */
export const registerSchema = new ValidationSchema({
  name: [new RequiredValidator("Вкажіть імʼя"), new MinLengthValidator(2)],
  email: [new RequiredValidator('Вкажіть email'), new EmailValidator()],
  password: [new RequiredValidator('Вкажіть пароль'), new PasswordValidator()],
});

/** Схема формы книги в админ-панели. */
export const bookSchema = new ValidationSchema({
  title: [new RequiredValidator('Вкажіть назву'), new MinLengthValidator(2), new MaxLengthValidator(120)],
  author: [new RequiredValidator('Вкажіть автора'), new MinLengthValidator(2)],
  genre: [new RequiredValidator('Оберіть жанр')],
  format: [new RequiredValidator('Оберіть формат')],
  price: [new RequiredValidator('Вкажіть ціну'), new NumberRangeValidator(1, 100000)],
  year: [new RequiredValidator('Вкажіть рік'), new NumberRangeValidator(1400, new Date().getFullYear() + 1)],
  stock: [new NumberRangeValidator(0, 10000, 'Від 0 до 10000')],
  description: [new MaxLengthValidator(1000)],
});
