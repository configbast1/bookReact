import PaperBook from './PaperBook.js';
import EBook from './EBook.js';
import AudioBook from './AudioBook.js';

export default class BookFactory {
  static registry = {
    paper: PaperBook,
    ebook: EBook,
    audio: AudioBook,
  };

  static create(raw) {
    const Cls = BookFactory.registry[raw?.format] ?? PaperBook;
    return new Cls(raw ?? {});
  }

  static createMany(list = []) {
    return list.map((raw) => BookFactory.create(raw));
  }

  static register(format, Cls) {
    BookFactory.registry[format] = Cls;
  }
}
