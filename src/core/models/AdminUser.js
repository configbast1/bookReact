import User from './User.js';

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
    return `${super.getDisplayName()} (admin)`;
  }

  toJSON() {
    return { ...super.toJSON(), department: this.department };
  }
}
