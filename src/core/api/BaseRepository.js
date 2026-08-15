import HttpClient from './HttpClient.js';
import { localStore } from '../storage/index.js';

/**
 * BaseRepository — базовый репозиторий (паттерн Repository).
 * Прячет источник данных: сначала пробует REST API (json-server),
 * а если сервер недоступен — работает с локальной копией в localStorage.
 * Благодаря этому демо-версия на хостинге живёт без бэкенда.
 */
export default class BaseRepository {
  constructor(resource, seed = []) {
    if (new.target === BaseRepository) {
      throw new TypeError('BaseRepository — абстрактний клас');
    }
    this.resource = resource;
    this.seed = seed;
    this.http = new HttpClient('/api');
    this.useApi = true; // переключается автоматически при первой ошибке сети
  }

  // ---------- локальный резервный режим ----------

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

  // ---------- публичный интерфейс ----------

  async getAll() {
    if (this.useApi) {
      try {
        return await this.http.get(`/${this.resource}`);
      } catch {
        this.useApi = false; // сервер не отвечает — уходим в офлайн-режим
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
