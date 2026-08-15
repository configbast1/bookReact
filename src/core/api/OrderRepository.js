import BaseRepository from './BaseRepository.js';
import { Order } from '../models/index.js';

/** OrderRepository — заказы. */
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

  /** Смена статуса заказа: правило перехода живёт в модели Order. */
  async changeStatus(id, nextStatus) {
    const raw = await this.getById(id);
    const order = new Order(raw);
    order.setStatus(nextStatus); // выбросит ошибку, если переход запрещён
    return this.update(id, order.toJSON());
  }
}
