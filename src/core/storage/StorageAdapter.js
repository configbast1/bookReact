/**
 * StorageAdapter — абстракция над любым хранилищем.
 * Приложение работает с интерфейсом (get/set/remove), а не с
 * конкретным localStorage или document.cookie.
 * Паттерн "Адаптер" + принцип подстановки Лисков (SOLID).
 */
export default class StorageAdapter {
  constructor(prefix = 'bs') {
    if (new.target === StorageAdapter) {
      throw new TypeError('StorageAdapter — абстрактний клас');
    }
    this.prefix = prefix;
  }

  /** Ключи в хранилище пишем с префиксом, чтобы не конфликтовать с другими сайтами. */
  buildKey(key) {
    return `${this.prefix}:${key}`;
  }

  // Абстрактные методы
  get() { throw new Error('Не реалізовано get()'); }
  set() { throw new Error('Не реалізовано set()'); }
  remove() { throw new Error('Не реалізовано remove()'); }

  /** Доступно ли хранилище в этом браузере (приватный режим и т.п.). */
  static isAvailable() {
    return false;
  }
}
