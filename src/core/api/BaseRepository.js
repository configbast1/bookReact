import HttpClient from './HttpClient.js';
import { localStore } from '../storage/index.js';

export default class BaseRepository {
  constructor(resource, seed = []) {
    if (new.target === BaseRepository) {
      throw new TypeError('BaseRepository is an abstract class');
    }
    this.resource = resource;
    this.seed = seed;
    this.http = new HttpClient('/api');
    this.useApi = true;
  }

  readLocal() {
    const stored = localStore.get(`db:${this.resource}`, null);
    if (stored) return stored;
    localStore.set(`db:${this.resource}`, this.seed);
    return [...this.seed];
  }

  writeLocal(list) {
    localStore.set(`db:${this.resource}`, list);
    return list;
  }

  async getAll() {
    if (this.useApi) {
      try {
        return await this.http.get(`/${this.resource}`);
      } catch {
        this.useApi = false;
      }
    }
    return this.readLocal();
  }

  async getById(id) {
    if (this.useApi) {
      try {
        return await this.http.get(`/${this.resource}/${id}`);
      } catch {
        this.useApi = false;
      }
    }
    return this.readLocal().find((item) => String(item.id) === String(id)) ?? null;
  }

  async create(payload) {
    if (this.useApi) {
      try {
        return await this.http.post(`/${this.resource}`, payload);
      } catch {
        this.useApi = false;
      }
    }
    const list = this.readLocal();
    this.writeLocal([payload, ...list]);
    return payload;
  }

  async update(id, payload) {
    if (this.useApi) {
      try {
        return await this.http.put(`/${this.resource}/${id}`, payload);
      } catch {
        this.useApi = false;
      }
    }
    const list = this.readLocal().map((item) =>
      String(item.id) === String(id) ? { ...item, ...payload } : item,
    );
    this.writeLocal(list);
    return payload;
  }

  async remove(id) {
    if (this.useApi) {
      try {
        await this.http.delete(`/${this.resource}/${id}`);
        return id;
      } catch {
        this.useApi = false;
      }
    }
    this.writeLocal(this.readLocal().filter((item) => String(item.id) !== String(id)));
    return id;
  }
}
