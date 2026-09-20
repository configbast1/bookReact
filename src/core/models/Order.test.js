import { describe, expect, it } from 'vitest';
import Order from './Order.js';

function createOrder(overrides = {}) {
  return new Order({
    id: 'ord_test_123456',
    items: [
      { bookId: 'b01', title: 'Book one', price: 100, quantity: 2 },
      { bookId: 'b02', title: 'Book two', price: 50, quantity: 1 },
    ],
    customer: { name: 'Test', phone: '+380671234567', city: 'Kyiv', address: 'Main 1' },
    shipping: 60,
    discount: 10,
    status: 'new',
    ...overrides,
  });
}

describe('Order model', () => {
  it('calculates items total, shipping and discount', () => {
    const order = createOrder();

    expect(order.itemsTotal).toBe(250);
    expect(order.itemsCount).toBe(3);
    expect(order.total).toBe(300);
  });

  it('allows only permitted status transitions', () => {
    const order = createOrder();

    expect(order.canTransitionTo('processing')).toBe(true);
    expect(order.canTransitionTo('done')).toBe(false);

    order.setStatus('processing');
    expect(order.status).toBe('processing');
  });

  it('throws on a forbidden status transition', () => {
    const order = createOrder({ status: 'done' });

    expect(() => order.setStatus('new')).toThrow();
  });

  it('builds a readable display name', () => {
    const order = createOrder();

    expect(order.getDisplayName()).toBe('Order #123456');
  });
});
