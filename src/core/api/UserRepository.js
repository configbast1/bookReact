import BaseRepository from './BaseRepository.js';
import { usersSeed } from '../../data/usersSeed.js';

/** UserRepository — пользователи (демо-логины). */
export default class UserRepository extends BaseRepository {
  constructor() {
    super('users', usersSeed);
  }

  async findByEmail(email) {
    const list = await this.getAll();
    return list.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) ?? null;
  }
}
