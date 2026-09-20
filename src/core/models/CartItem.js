import Book from './Book.js';

export default class CartItem {
  constructor(book, quantity = 1) {
    if (!(book instanceof Book)) {
      throw new TypeError('CartItem expects a Book instance');
    }
    this.book = book;
    this.quantity = Math.max(1, Number(quantity) || 1);
  }

  get subtotal() {
    return Math.round(this.book.getFinalPrice() * this.quantity * 100) / 100;
  }

  get savings() {
    return Math.round((this.book.price - this.book.getFinalPrice()) * this.quantity * 100) / 100;
  }

  toJSON() {
    return { bookId: this.book.id, quantity: this.quantity, subtotal: this.subtotal };
  }
}
