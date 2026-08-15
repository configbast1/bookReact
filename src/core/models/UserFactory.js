import Customer from './Customer.js';
import AdminUser from './AdminUser.js';

/** Фабрика пользователей: по полю role создаёт нужный подкласс. */
export default class UserFactory {
  static registry = { customer: Customer, admin: AdminUser };

  static create(raw) {
    const Cls = UserFactory.registry[raw?.role] ?? Customer;
    return new Cls(raw ?? {});
  }
}
