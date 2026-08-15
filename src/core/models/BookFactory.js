import PaperBook from './PaperBook.js';
import EBook from './EBook.js';
import AudioBook from './AudioBook.js';

/**
 * BookFactory — реализация паттерна "Фабрика".
 * Превращает "сырой" JSON из API/localStorage в объект нужного класса.
 */
export default class BookFactory {
  /** Реестр: формат -> класс. Новый формат добавляется одной строкой. */
  static registry = {
    paper: PaperBook,
    ebook: EBook,
    audio: AudioBook,
  };

  static create(raw) {
    const Cls = BookFactory.registry[raw?.format] ?? PaperBook;
    return new Cls(raw ?? {});
  }

  /** Массовое преобразование списка. */
  static createMany(list = []) {
    return list.map((raw) => BookFactory.create(raw));
  }

  /** Регистрация нового формата извне (расширяемость без правки фабрики). */
  static register(format, Cls) {
    BookFactory.registry[format] = Cls;
  }
}
