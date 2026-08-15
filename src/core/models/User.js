import Entity from './Entity.js';

/**
 * User — базовый пользователь. Ещё одна ветка наследования от Entity.
 * Наследники: Customer (покупатель) и AdminUser (админ).
 */
export default class User extends Entity {
  #email;
  #passwordHash;

  constructor({ id, createdAt, name, email, password = '', passwordHash = '', avatar = '' }) {
    super(id, createdAt);
    if (new.target === User) {
      throw new TypeError('User — абстрактный класс, используйте Customer или AdminUser');
    }
    this.name = name;
    this.avatar = avatar;
    this.#email = '';
    this.email = email;
    this.#passwordHash = passwordHash || User.hash(password);
  }

  get email() {
    return this.#email;
  }

  set email(value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value))) {
      throw new TypeError('Некоректний email');
    }
    this.#email = String(value).toLowerCase();
  }

  /**
   * Учебный "хеш" пароля. В реальном проекте — bcrypt/argon2 на бэкенде.
   * Здесь показываем инкапсуляцию: наружу пароль не отдаётся никогда.
   */
  static hash(value) {
    let h = 0;
    const str = String(value);
    for (let i = 0; i < str.length; i += 1) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return `h${Math.abs(h).toString(36)}`;
  }

  checkPassword(candidate) {
    return User.hash(candidate) === this.#passwordHash;
  }

  /** Полиморфный метод: набор прав зависит от роли. */
  get permissions() {
    return ['catalog:read'];
  }

  can(permission) {
    return this.permissions.includes(permission);
  }

  get isAdmin() {
    return false;
  }

  getDisplayName() {
    return this.name || this.#email;
  }

  /** Инициалы для аватара. */
  getInitials() {
    return this.getDisplayName()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toJSON() {
    // Обратите внимание: passwordHash наружу не уходит.
    return {
      ...super.toJSON(),
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      role: this.constructor.ROLE,
      isAdmin: this.isAdmin,
    };
  }
}
