import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/ui';
import { useCart } from '@/hooks';
import env, { currencySign } from '@/config/env.js';
import styles from './CartSummary.module.css';

function Row({ label, value, tone }) {
  return (
    <div className={styles.row}>
      <span>{label}</span>
      <span className={tone === 'success' ? styles.green : ''}>{value}</span>
    </div>
  );
}

Row.propTypes = { label: PropTypes.node, value: PropTypes.node, tone: PropTypes.string };

export default function CartSummary({ children, showPromo = true }) {
  const { t } = useTranslation();
  const { totals, promo, applyPromoCode } = useCart();
  const [code, setCode] = useState('');

  const handlePromo = (event) => {
    event.preventDefault();
    if (applyPromoCode(code)) setCode('');
  };

  const freeShippingLeft = Math.max(0, env.freeShippingFrom - totals.subtotal);

  return (
    <aside className={styles.summary}>
      <h3 className={styles.title}>{t('summary.title')}</h3>

      <Row
        label={t('summary.items', { count: totals.count })}
        value={`${totals.subtotal} ${currencySign}`}
      />

      {totals.savings > 0 && (
        <Row
          label={t('summary.formatDiscount')}
          value={`−${totals.savings} ${currencySign}`}
          tone="success"
        />
      )}

      {promo && (
        <Row
          label={t('summary.promo', { code: promo.code })}
          value={`−${totals.promoDiscount} ${currencySign}`}
          tone="success"
        />
      )}

      <Row
        label={t('summary.shipping')}
        value={totals.shipping === 0 ? t('summary.free') : `${totals.shipping} ${currencySign}`}
        tone={totals.shipping === 0 ? 'success' : undefined}
      />

      {freeShippingLeft > 0 && totals.subtotal > 0 && (
        <p className={styles.hint}>
          {t('summary.freeLeft', { sum: `${Math.round(freeShippingLeft)} ${currencySign}` })}
        </p>
      )}

      <div className={styles.total}>
        <span>{t('summary.total')}</span>
        <strong>
          {totals.total} {currencySign}
        </strong>
      </div>

      {showPromo && (
        <form className={styles.promo} onSubmit={handlePromo}>
          <Input
            placeholder={t('summary.promoPlaceholder')}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            hint={t('summary.promoHint')}
          />
          <Button type="submit" variant="secondary" size="sm">
            {t('common.apply')}
          </Button>
        </form>
      )}

      {children}
    </aside>
  );
}

CartSummary.propTypes = { children: PropTypes.node, showPromo: PropTypes.bool };
