import { Link, useNavigate } from 'react-router-dom';
import { Button, EmptyState, Modal } from '@/components/ui';
import { CartItemRow, CartSummary } from '@/components/cart';
import { useCart } from '@/hooks';
import { useState } from 'react';
import styles from './CartPage.module.css';

/** CartPage — корзина. */
export default function CartPage() {
  const { items, clear, totals } = useCart();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container page">
        <h1>Кошик</h1>
        <EmptyState
          icon="🛒"
          title="Кошик порожній"
          description="Додайте книги з каталогу — вони зберігатимуться навіть після перезавантаження сторінки."
          action={<Link to="/catalog"><Button>Перейти до каталогу</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="pageHeader">
        <h1>Кошик</h1>
        <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
          Очистити кошик
        </Button>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <CartItemRow key={item.book.id} item={item} />
          ))}
        </div>

        <CartSummary>
          <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
            Оформити замовлення
          </Button>
          <Link to="/catalog" className={styles.continue}>← Продовжити покупки</Link>
        </CartSummary>
      </div>

      <Modal
        open={confirmOpen}
        title="Очистити кошик?"
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Скасувати</Button>
            <Button variant="danger" onClick={() => { clear(); setConfirmOpen(false); }}>
              Так, очистити
            </Button>
          </>
        }
      >
        <p>З кошика буде видалено {totals.count} товарів на суму {totals.subtotal} ₴. Дію не можна скасувати.</p>
      </Modal>
    </div>
  );
}
