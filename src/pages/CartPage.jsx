import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, ConfirmDialog, EmptyState } from '@/components/ui';
import { CartList, CartSummary } from '@/components/cart';
import { useCart } from '@/hooks';
import { currencySign } from '@/config/env.js';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, clear, totals } = useCart();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container page">
        <h1>{t('cart.title')}</h1>
        <EmptyState
          icon="🛒"
          title={t('cart.emptyTitle')}
          description={t('cart.emptyText')}
          action={
            <Link to="/catalog">
              <Button>{t('cart.emptyAction')}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="pageHeader">
        <h1>{t('cart.title')}</h1>
        <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
          {t('cart.clear')}
        </Button>
      </div>

      <div className={styles.layout}>
        <div className={styles.items}>
          <CartList items={items} />
        </div>

        <CartSummary>
          <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
            {t('cart.checkout')}
          </Button>
          <Link to="/catalog" className={styles.continue}>
            {t('cart.continue')}
          </Link>
        </CartSummary>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t('cart.confirmTitle')}
        description={t('cart.confirmText', {
          count: totals.count,
          sum: `${totals.subtotal} ${currencySign}`,
        })}
        confirmLabel={t('cart.confirmOk')}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          clear();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
