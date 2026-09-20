import BaseRepository from './BaseRepository.js';
import { Order } from '../models/index.js';

export default class OrderRepository extends BaseRepository {
  constructor() {
    super('orders', []);
  }

  async getAllAsModels() {
    const raw = await this.getAll();
    return raw.map((item) => new Order(item));
  }

  async getByUser(userId) {
    const raw = await this.getAll();
    return raw.filter((o) => o.userId === userId);
  }

  async changeStatus(id, nextStatus) {
    const raw = await this.getById(id);
    const order = new Order(raw);
    order.setStatus(nextStatus);
    return this.update(id, order.toJSON());
  }
}
