import BookRepository from './BookRepository.js';
import OrderRepository from './OrderRepository.js';
import UserRepository from './UserRepository.js';

export { default as HttpClient, HttpError } from './HttpClient.js';
export { default as BaseRepository } from './BaseRepository.js';
export { BookRepository, OrderRepository, UserRepository };

export const bookRepository = new BookRepository();
export const orderRepository = new OrderRepository();
export const userRepository = new UserRepository();
