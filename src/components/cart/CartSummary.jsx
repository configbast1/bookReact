import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from '@/components/ui';
import { useCart } from '@/hooks';
import styles from './CartSummary.module.css';

/** CartSummary — блок итогов: сумма, доставка, промокод. */
export default function CartSummary({ children, showPromo = true }) {
  const { totals, promo, applyPromoCode } = useCart();
  const [code, setCode] = useState('');

  const handlePromo = (event) => {
    event.preventDefault();
    if (applyPromoCode(code)) setCode('');
  };

  const freeShippingLeft = Math.max(0, 700 - totals.subtotal);

  return (
    <aside className={styles.summary}>
      <h3 className={styles.title}>Разом</h3>

      <Row label={`Товари (${totals.count} шт.)`} value={`${totals.subtotal} ₴`} />
      {totals.savings > 0 && (
        <Row label="Знижка на формат" value={`−${totals.savings} ₴`} tone="success" />
      )}
      {promo && (
        <Row label={`Промокод ${promo.code}`} value={`−${totals.promoDiscount} ₴`} tone="success" />
      )}
      <Row
        label="Доставка"
        value={totals.shipping === 0 ? 'Безкоштовно' : `${totals.shipping} ₴`}
        tone={totals.shipping === 0 ? 'success' : undefined}
      />

      {freeShippingLeft > 0 && totals.subtotal > 0 && (
        <p className={styles.hint}>
          Додайте товарів на {Math.round(freeShippingLeft)} ₴ для безкоштовної доставки
        </p>
      )}

      <div className={styles.total}>
        <span>До сплати</span>
        <strong>{totals.total} ₴</strong>
      </div>

      {showPromo && (
        <form className={styles.promo} onSubmit={handlePromo}>
          <Input
            placeholder="Промокод"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            hint="Спробуйте BOOK10 або STUDENT"
          />
          <Button type="submit" variant="secondary" size="sm">Застосувати</Button>
        </form>
      )}

      {children}
    </aside>
  );
}

CartSummary.propTypes = { children: PropTypes.node, showPromo: PropTypes.bool };

function Row({ label, value, tone }) {
  return (
    <div className={styles.row}>
      <span>{label}</span>
      <span className={tone === 'success' ? styles.green : ''}>{value}</span>
    </div>
  );
}

Row.propTypes = { label: PropTypes.string, value: PropTypes.node, tone: PropTypes.string };
