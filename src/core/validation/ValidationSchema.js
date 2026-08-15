/**
 * ValidationSchema — композиция правил.
 * Хранит карту: имя поля -> массив валидаторов.
 * Используется хуком useForm.
 */
export default class ValidationSchema {
  constructor(fields = {}) {
    this.fields = fields;
  }

  /** Проверка одного поля: возвращает первую ошибку или null. */
  validateField(name, value, allValues = {}) {
    const rules = this.fields[name] ?? [];
    for (const rule of rules) {
      const error = rule.validate(value, allValues);
      if (error) return error;
    }
    return null;
  }

  /** Проверка всей формы: возвращает объект { поле: 'текст ошибки' }. */
  validate(values) {
    const errors = {};
    Object.keys(this.fields).forEach((name) => {
      const error = this.validateField(name, values[name], values);
      if (error) errors[name] = error;
    });
    return errors;
  }

  get fieldNames() {
    return Object.keys(this.fields);
  }
}
