import Product from './Product.js';

/**
 * Book — книга. Уровень 3 иерархии.
 * Добавляет автора, жанр, год, рейтинг, ISBN.
 */
export default class Book extends Product {
  #rating;

  /** Формат по умолчанию, переопределяется в наследниках. */
  static FORMAT = 'book';

  constructor(data) {
    super(data);
    const {
      author = 'Невідомий автор',
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
      throw new RangeError('Рейтинг має бути від 0 до 5');
    }
    this.#rating = Math.round(num * 10) / 10;
  }

  /** Формат книги берётся из статического поля конкретного класса. */
  get format() {
    return this.constructor.FORMAT;
  }

  /** Новинкой считаем книгу за последние 3 года. */
  get isNew() {
    return new Date().getFullYear() - this.year <= 3;
  }

  /** Переопределение метода родителя (полиморфизм). */
  getDisplayName() {
    return `${this.title} — ${this.author}`;
  }

  /** Строка, по которой работает текстовый поиск в каталоге. */
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
