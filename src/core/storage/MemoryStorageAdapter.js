import StorageAdapter from './StorageAdapter.js';

export default class MemoryStorageAdapter extends StorageAdapter {
  #map = new Map();

  static isAvailable() {
    return true;
  }

  get(key, fallback = null) {
    return this.#map.has(this.buildKey(key)) ? this.#map.get(this.buildKey(key)) : fallback;
  }

  set(key, value) {
    this.#map.set(this.buildKey(key), value);
    return true;
  }

  remove(key) {
    this.#map.delete(this.buildKey(key));
  }
}
