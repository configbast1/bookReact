import User from './User.js';

/** Customer — обычный покупатель. */
export default class Customer extends User {
  static ROLE = 'customer';

  constructor(data) {
    super(data);
    this.phone = data.phone ?? '';
    this.address = data.address ?? '';
    this.bonusPoints = Number(data.bonusPoints ?? 0);
  }

  /** Расширяем права родителя (super используется как значение). */
  get permissions() {
    return [...super.permissions, 'cart:write', 'order:create', 'order:read:own'];
  }

  /** Персональная скидка от накопленных бонусов. */
  getLoyaltyDiscount() {
    if (this.bonusPoints >= 1000) return 10;
    if (this.bonusPoints >= 500) return 5;
    return 0;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      phone: this.phone,
      address: this.address,
      bonusPoints: this.bonusPoints,
    };
  }
}
