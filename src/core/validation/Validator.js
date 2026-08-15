/**
 * Validator — базовый абстрактный класс всех правил валидации.
 * Наследники реализуют только check(), сообщение об ошибке общее.
 * Это классический пример полиморфизма: форма вызывает validate()
 * и не знает, какое именно правило внутри.
 */
export default class Validator {
  constructor(message) {
    if (new.target === Validator) {
      throw new TypeError('Validator — абстрактний клас');
    }
    this.message = message ?? 'Некоректне значення';
  }

  /** Абстрактный метод: true = значение валидно. */
  check() {
    throw new Error(`${this.constructor.name} має реалізувати check()`);
  }

  /**
   * Общий алгоритм (шаблонный метод): вернуть текст ошибки или null.
   * @param {*} value значение поля
   * @param {object} allValues все значения формы (для сравнения полей)
   */
  validate(value, allValues = {}) {
    return this.check(value, allValues) ? null : this.message;
  }
}
