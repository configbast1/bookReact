import BookRepository from './BookRepository.js';
import OrderRepository from './OrderRepository.js';
import UserRepository from './UserRepository.js';

export { default as HttpClient, HttpError } from './HttpClient.js';
export { default as BaseRepository } from './BaseRepository.js';
export { BookRepository, OrderRepository, UserRepository };

// Синглтоны репозиториев — используются в thunk'ах Redux и контекстах.
export const bookRepository = new BookRepository();
export const orderRepository = new OrderRepository();
export const userRepository = new UserRepository();
