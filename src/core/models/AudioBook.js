import Book from './Book.js';

export default class AudioBook extends Book {
  static FORMAT = 'audio';

  constructor(data) {
    super({ ...data, stock: 9999 });
    this.narrator = data.narrator ?? 'Студія озвучення';
    this.durationMin = Number(data.durationMin ?? 300);
  }

  getDiscountPercent() {
    return 10;
  }

  getShippingCost() {
    return 0;
  }

  getFormattedDuration() {
    const h = Math.floor(this.durationMin / 60);
    const m = this.durationMin % 60;
    return `${h} год ${m} хв`;
  }

  getDisplayName() {
    return `${super.getDisplayName()} 🎧 ${this.getFormattedDuration()}`;
  }

  toJSON() {
    return { ...super.toJSON(), narrator: this.narrator, durationMin: this.durationMin };
  }
}
