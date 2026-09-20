import Entity from './Entity.js';

export default class User extends Entity {
  #email;
  #passwordHash;

  constructor({ id, createdAt, name, email, password = '', passwordHash = '', avatar = '' }) {
    super(id, createdAt);
    if (new.target === User) {
      throw new TypeError('User is an abstract class, use Customer or AdminUser');
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
      throw new TypeError('Invalid email');
    }
    this.#email = String(value).toLowerCase();
  }

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

  getInitials() {
    return this.getDisplayName()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toJSON() {
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
