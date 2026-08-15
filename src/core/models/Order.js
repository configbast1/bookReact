import Entity from './Entity.js';

/**
 * Order — заказ. Третья ветка наследования от Entity.
 * Инкапсулирует переходы статусов (машина состояний).
 */
export default class Order extends Entity {
  #status;

  /** Допустимые статусы и разрешённые переходы между ними. */
  static STATUSES = ['new', 'processing', 'shipped', 'done', 'cancelled'];

  static TRANSITIONS = {
    new: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['done'],
    done: [],
    cancelled: [],
  };

  static STATUS_LABELS = {
    new: 'Новий',
    processing: 'В обробці',
    shipped: 'Відправлено',
    done: 'Виконано',
    cancelled: 'Скасовано',
  };

  constructor(data) {
    super(data.id ?? Entity.generateId('ord'), data.createdAt);
    this.items = data.items ?? []; // [{ bookId, title, price, quantity }]
    this.customer = data.customer ?? {}; // { name, email, phone, address, payment, delivery }
    this.userId = data.userId ?? null;
    this.shipping = Number(data.shipping ?? 0);
    this.discount = Number(data.discount ?? 0);
    this.comment = data.comment ?? '';
    this.#status = Order.STATUSES.includes(data.status) ? data.status : 'new';
  }

  get status() {
    return this.#status;
  }

  get statusLabel() {
    return Order.STATUS_LABELS[this.#status];
  }

  /** Сумма товаров без доставки и скидки. */
  get itemsTotal() {
    return Math.round(this.items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
  }

  get total() {
    const value = this.itemsTotal + this.shipping - this.discount;
    return Math.round(Math.max(0, value) * 100) / 100;
  }

  get itemsCount() {
    return this.items.reduce((s, i) => s + i.quantity, 0);
  }

  /** Можно ли перевести заказ в статус next. */
  canTransitionTo(next) {
    return (Order.TRANSITIONS[this.#status] ?? []).includes(next);
  }

  /** Смена статуса с проверкой — бизнес-правило внутри модели, а не в UI. */
  setStatus(next) {
    if (!this.canTransitionTo(next)) {
      throw new Error(`Неможливо змінити статус з "${this.statusLabel}" на "${Order.STATUS_LABELS[next] ?? next}"`);
    }
    this.#status = next;
    return this;
  }

  getDisplayName() {
    return `Замовлення №${this.id.slice(-6).toUpperCase()}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      items: this.items,
      customer: this.customer,
      userId: this.userId,
      shipping: this.shipping,
      discount: this.discount,
      comment: this.comment,
      status: this.#status,
      itemsTotal: this.itemsTotal,
      total: this.total,
    };
  }
}
