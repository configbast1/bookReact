export default class StorageAdapter {
  constructor(prefix = 'bs') {
    if (new.target === StorageAdapter) {
      throw new TypeError('StorageAdapter is an abstract class');
    }
    this.prefix = prefix;
  }

  buildKey(key) {
    return `${this.prefix}:${key}`;
  }

  get() { throw new Error('get() is not implemented'); }
  set() { throw new Error('set() is not implemented'); }
  remove() { throw new Error('remove() is not implemented'); }

  static isAvailable() {
    return false;
  }
}
