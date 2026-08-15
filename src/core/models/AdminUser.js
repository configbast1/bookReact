import User from './User.js';

/** AdminUser — администратор магазина, имеет доступ к админ-панели. */
export default class AdminUser extends User {
  static ROLE = 'admin';

  constructor(data) {
    super(data);
    this.department = data.department ?? 'general';
  }

  get permissions() {
    return [
      ...super.permissions,
      'catalog:write',
      'catalog:delete',
      'order:read:all',
      'order:update',
      'admin:panel',
    ];
  }

  get isAdmin() {
    return true;
  }

  getDisplayName() {
    return `${super.getDisplayName()} (адмін)`;
  }

  toJSON() {
    return { ...super.toJSON(), department: this.department };
  }
}
