import Book from './Book.js';

/**
 * CartItem — позиция корзины. Композиция: содержит книгу и количество.
 * Не наследник Entity — это value-object.
 */
export default class CartItem {
  constructor(book, quantity = 1) {
    if (!(book instanceof Book)) {
      throw new TypeError('CartItem очікує екземпляр Book');
    }
    this.book = book;
    this.quantity = Math.max(1, Number(quantity) || 1);
  }

  get subtotal() {
    return Math.round(this.book.getFinalPrice() * this.quantity * 100) / 100;
  }

  /** Сколько сэкономлено на этой позиции. */
  get savings() {
    return Math.round((this.book.price - this.book.getFinalPrice()) * this.quantity * 100) / 100;
  }

  toJSON() {
    return { bookId: this.book.id, quantity: this.quantity, subtotal: this.subtotal };
  }
}
