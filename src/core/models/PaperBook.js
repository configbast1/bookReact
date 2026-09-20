import Book from './Book.js';

export default class PaperBook extends Book {
  static FORMAT = 'paper';

  constructor(data) {
    super(data);
    this.cover = data.cover ?? 'soft';
    this.weight = Number(data.weight ?? 300);
  }

  getShippingCost() {
    const base = 60;
    return this.cover === 'hard' ? base + 20 : base;
  }

  getDisplayName() {
    const cover = this.cover === 'hard' ? 'тверда обкладинка' : 'мʼяка обкладинка';
    return `${super.getDisplayName()} (${cover})`;
  }

  toJSON() {
    return { ...super.toJSON(), cover: this.cover, weight: this.weight };
  }
}
