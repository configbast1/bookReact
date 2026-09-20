import BaseRepository from './BaseRepository.js';
import { BookFactory } from '../models/index.js';
import { booksSeed } from '../../data/booksSeed.js';

export default class BookRepository extends BaseRepository {
  constructor() {
    super('books', booksSeed);
  }

  async getAllAsModels() {
    const raw = await this.getAll();
    return BookFactory.createMany(raw);
  }

  async getModelById(id) {
    const raw = await this.getById(id);
    return raw ? BookFactory.create(raw) : null;
  }

  async getFacet(field) {
    const raw = await this.getAll();
    return [...new Set(raw.map((b) => b[field]).filter(Boolean))].sort();
  }
}
