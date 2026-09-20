export default class Entity {
  #id;
  #createdAt;

  static instanceCount = 0;

  constructor(id = null, createdAt = null) {
    if (new.target === Entity) {
      throw new TypeError('Entity is an abstract class');
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

  get type() {
    return this.constructor.name;
  }

  static generateId(prefix = 'e') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  getDisplayName() {
    throw new Error(`${this.constructor.name} must implement getDisplayName()`);
  }

  toJSON() {
    return { id: this.#id, createdAt: this.#createdAt.toISOString(), type: this.type };
  }

  equals(other) {
    return other instanceof Entity && other.id === this.#id;
  }

  toString() {
    return `[${this.type} ${this.#id}]`;
  }
}
