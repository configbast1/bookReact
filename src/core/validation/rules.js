import Validator from './Validator.js';

/** Обязательное поле. */
export class RequiredValidator extends Validator {
  constructor(message = "Поле обовʼязкове") {
    super(message);
  }

  check(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value === true;
    return value !== null && value !== undefined && String(value).trim() !== '';
  }
}

/** Минимальная длина строки. */
export class MinLengthValidator extends Validator {
  constructor(min, message) {
    super(message ?? `Мінімум ${min} символів`);
    this.min = min;
  }

  check(value) {
    return String(value ?? '').trim().length >= this.min;
  }
}

/** Максимальная длина строки. */
export class MaxLengthValidator extends Validator {
  constructor(max, message) {
    super(message ?? `Максимум ${max} символів`);
    this.max = max;
  }

  check(value) {
    return String(value ?? '').length <= this.max;
  }
}

/** Проверка по регулярному выражению — родитель для Email/Phone. */
export class PatternValidator extends Validator {
  constructor(pattern, message = 'Невірний формат') {
    super(message);
    this.pattern = pattern;
  }

  check(value) {
    if (value === '' || value === null || value === undefined) return true; // пустое проверяет Required
    return this.pattern.test(String(value).trim());
  }
}

/** Email — наследник PatternValidator, четвёртый уровень иерархии. */
export class EmailValidator extends PatternValidator {
  constructor(message = 'Введіть коректний email, напр. user@mail.com') {
    super(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message);
  }
}

/** Украинский телефон: +380XXXXXXXXX или 0XXXXXXXXX. */
export class PhoneValidator extends PatternValidator {
  constructor(message = 'Телефон у форматі +380XXXXXXXXX') {
    super(/^(\+?38)?0\d{9}$/, message);
  }

  /** Перед проверкой убираем пробелы, скобки и дефисы. */
  check(value) {
    const cleaned = String(value ?? '').replace(/[\s()-]/g, '');
    return super.check(cleaned);
  }
}

/** Числовой диапазон. */
export class NumberRangeValidator extends Validator {
  constructor(min, max, message) {
    super(message ?? `Число має бути від ${min} до ${max}`);
    this.min = min;
    this.max = max;
  }

  check(value) {
    const num = Number(value);
    return !Number.isNaN(num) && num >= this.min && num <= this.max;
  }
}

/** Совпадение с другим полем формы (пароль / подтверждение). */
export class MatchValidator extends Validator {
  constructor(field, message = 'Значення не збігаються') {
    super(message);
    this.field = field;
  }

  check(value, allValues) {
    return value === allValues[this.field];
  }
}

/** Пароль: длина + буква + цифра. */
export class PasswordValidator extends Validator {
  constructor(message = 'Мінімум 6 символів, літера та цифра') {
    super(message);
  }

  check(value) {
    const str = String(value ?? '');
    return str.length >= 6 && /[a-zA-Zа-яА-ЯіїєІЇЄ]/.test(str) && /\d/.test(str);
  }
}
