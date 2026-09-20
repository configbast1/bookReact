import User from './User.js';

export default class Customer extends User {
  static ROLE = 'customer';

  constructor(data) {
    super(data);
    this.phone = data.phone ?? '';
    this.address = data.address ?? '';
    this.bonusPoints = Number(data.bonusPoints ?? 0);
  }

  get permissions() {
    return [...super.permissions, 'cart:write', 'order:create', 'order:read:own'];
  }

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
