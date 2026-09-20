import Entity from './Entity.js';

export default class Product extends Entity {
  #price;
  #stock;

  constructor({ id, createdAt, title, price, stock = 0, image = '', category = 'other' }) {
    super(id, createdAt);
    if (new.target === Product) {
      throw new TypeError('Product is an abstract class');
    }
    this.title = title;
    this.image = image;
    this.category = category;
    this.#price = 0;
    this.#stock = 0;
    this.price = price;
    this.stock = stock;
  }

  get price() {
    return this.#price;
  }

  set price(value) {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      throw new RangeError('Price cannot be negative');
    }
    this.#price = Math.round(num * 100) / 100;
  }

  get stock() {
    return this.#stock;
  }

  set stock(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 0) {
      throw new RangeError('Stock must be a non-negative integer');
    }
    this.#stock = num;
  }

  get inStock() {
    return this.#stock > 0;
  }

  getDiscountPercent() {
    return 0;
  }

  getFinalPrice() {
    const discount = this.getDiscountPercent();
    return Math.round(this.price * (1 - discount / 100) * 100) / 100;
  }

  getDisplayName() {
    return this.title;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      price: this.price,
      stock: this.stock,
      image: this.image,
      category: this.category,
    };
  }
}
