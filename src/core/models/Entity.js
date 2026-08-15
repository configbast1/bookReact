/**
 * Entity — базовый (абстрактный) класс всей доменной модели.
 * От него наследуются Product, User, Order и др.
 *
 * Демонстрирует:
 *  - защиту от прямого создания абстрактного класса (new.target)
 *  - инкапсуляцию через приватные поля (#id, #createdAt)
 *  - геттеры
 *  - статический счётчик экземпляров
 *  - "абстрактные" методы, которые обязан переопределить наследник
 */
export default class Entity {
  /** Приватные поля — недоступны снаружи класса. */
  #id;
  #createdAt;

  /** Статический счётчик созданных сущностей (общий для всей иерархии). */
  static instanceCount = 0;

  constructor(id = null, createdAt = null) {
    if (new.target === Entity) {
      throw new TypeError('Entity — абстрактный класс, его нельзя создать напрямую');
    }
    this.#id = id ?? Entity.generateId();
    this.#createdAt = createdAt ? new Date(createdAt) : new Date();
    Entity.instanceCount += 1;
  }

  get id() {
    return this.#id;
  }

  get createdAt() {
    return this.#createdAt;
  }

  /** Тип сущности = имя класса. Полезно для логов и отладки. */
  get type() {
    return this.constructor.name;
  }

  /** Генератор идентификаторов (без внешних библиотек). */
  static generateId(prefix = 'e') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  /**
   * Абстрактный метод — наследник ОБЯЗАН его переопределить.
   * Возвращает человекочитаемое название сущности.
   */
  getDisplayName() {
    throw new Error(`${this.constructor.name} должен реализовать getDisplayName()`);
  }

  /** Сериализация в обычный объект (для Redux/localStorage/json-server). */
  toJSON() {
    return { id: this.#id, createdAt: this.#createdAt.toISOString(), type: this.type };
  }

  /** Сравнение сущностей по идентификатору. */
  equals(other) {
    return other instanceof Entity && other.id === this.#id;
  }

  toString() {
    return `[${this.type} ${this.#id}]`;
  }
}
