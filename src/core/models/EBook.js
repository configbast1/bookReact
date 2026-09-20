import Book from './Book.js';

export default class EBook extends Book {
  static FORMAT = 'ebook';

  constructor(data) {
    super({ ...data, stock: 9999 });
    this.fileFormat = data.fileFormat ?? 'pdf';
    this.fileSizeMb = Number(data.fileSizeMb ?? 5);
  }

  getDiscountPercent() {
    return 15;
  }

  getShippingCost() {
    return 0;
  }

  getDisplayName() {
    return `${super.getDisplayName()} [${this.fileFormat.toUpperCase()}]`;
  }

  toJSON() {
    return { ...super.toJSON(), fileFormat: this.fileFormat, fileSizeMb: this.fileSizeMb };
  }
}
