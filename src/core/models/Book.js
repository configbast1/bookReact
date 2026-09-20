import Product from './Product.js';

export default class Book extends Product {
  #rating;

  static FORMAT = 'book';

  constructor(data) {
    super(data);
    const {
      author = 'Unknown author',
      genre = 'other',
      year = new Date().getFullYear(),
      pages = 0,
      isbn = '',
      description = '',
      rating = 0,
      reviewsCount = 0,
      language = 'uk',
    } = data;

    this.author = author;
    this.genre = genre;
    this.year = Number(year);
    this.pages = Number(pages);
    this.isbn = isbn;
    this.description = description;
    this.language = language;
    this.reviewsCount = Number(reviewsCount);
    this.#rating = 0;
    this.rating = rating;
  }

  get rating() {
    return this.#rating;
  }

  set rating(value) {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0 || num > 5) {
      throw new RangeError('Rating must be between 0 and 5');
    }
    this.#rating = Math.round(num * 10) / 10;
  }

  get format() {
    return this.constructor.FORMAT;
  }

  get isNew() {
    return new Date().getFullYear() - this.year <= 3;
  }

  getDisplayName() {
    return `${this.title} — ${this.author}`;
  }

  getSearchIndex() {
    return [this.title, this.author, this.genre, this.isbn, this.description]
      .join(' ')
      .toLowerCase();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      author: this.author,
      genre: this.genre,
      year: this.year,
      pages: this.pages,
      isbn: this.isbn,
      description: this.description,
      language: this.language,
      rating: this.rating,
      reviewsCount: this.reviewsCount,
      format: this.format,
    };
  }

}
