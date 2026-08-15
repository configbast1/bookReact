import Book from './Book.js';

/** Електронна книга — нет склада, есть скидка, доставка бесплатна. */
export default class EBook extends Book {
  static FORMAT = 'ebook';

  constructor(data) {
    super({ ...data, stock: 9999 }); // цифровой товар не заканчивается
    this.fileFormat = data.fileFormat ?? 'pdf'; // pdf | epub | fb2
    this.fileSizeMb = Number(data.fileSizeMb ?? 5);
  }

  /** Переопределяем скидку родителя: на электронные книги -15%. */
  getDiscountPercent() {
    return 15;
  }

  getShippingCost() {
    return 0; // цифровая доставка бесплатна
  }

  getDisplayName() {
    return `${super.getDisplayName()} [${this.fileFormat.toUpperCase()}]`;
  }

  toJSON() {
    return { ...super.toJSON(), fileFormat: this.fileFormat, fileSizeMb: this.fileSizeMb };
  }
}
