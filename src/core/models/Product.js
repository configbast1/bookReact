import Entity from './Entity.js';

/**
 * Product — общий товар магазина. Наследник Entity.
 * Уровень 2 иерархии: Entity -> Product -> Book -> PaperBook/EBook/AudioBook
 */
export default class Product extends Entity {
  #price;
  #stock;

  constructor({ id, createdAt, title, price, stock = 0, image = '', category = 'other' }) {
    super(id, createdAt); // вызов конструктора родителя
    if (new.target === Product) {
      throw new TypeError('Product — абстрактный класс, создавайте конкретный товар (Book и т.п.)');
    }
    this.title = title;
    this.image = image;
    this.category = category;
    this.#price = 0;
    this.#stock = 0;
    this.price = price; // проходит через сеттер с валидацией
    this.stock = stock;
  }

  /** Геттер/сеттер: цена не может быть отрицательной. */
  get price() {
    return this.#price;
  }

  set price(value) {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      throw new RangeError('Ціна не може бути відʼємною');
    }
    this.#price = Math.round(num * 100) / 100;
  }

  get stock() {
    return this.#stock;
  }

  set stock(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 0) {
      throw new RangeError('Кількість на складі — ціле невідʼємне число');
    }
    this.#stock = num;
  }

  get inStock() {
    return this.#stock > 0;
  }

  /**
   * Полиморфизм: базовая скидка = 0.
   * Наследники переопределяют этот метод (см. EBook).
   */
  getDiscountPercent() {
    return 0;
  }

  /** Итоговая цена с учётом скидки конкретного типа товара. */
  getFinalPrice() {
    const discount = this.getDiscountPercent();
    return Math.round(this.price * (1 - discount / 100) * 100) / 100;
  }

  getDisplayName() {
    return this.title;
  }

  toJSON() {
    return {
      ...super.toJSON(), // переиспользуем реализацию родителя
      title: this.title,
      price: this.price,
      stock: this.stock,
      image: this.image,
      category: this.category,
    };
  }
}
