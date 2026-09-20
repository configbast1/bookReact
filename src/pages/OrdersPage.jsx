import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchOrders, selectOrders, selectOrdersStatus } from '@/store';
import { Order } from '@/core/models';
import { useAuth } from '@/context/AuthContext.jsx';
import { Button, EmptyState, Spinner } from '@/components/ui';
import { OrderList } from '@/components/orders';

export default function OrdersPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const raw = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const { user, isAuthenticated } = useAuth();
  const [params] = useSearchParams();
  const highlight = params.get('highlight');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchOrders());
  }, [status, dispatch]);

  const orders = useMemo(() => {
    const list = raw.map((item) => new Order(item));
    return isAuthenticated ? list.filter((o) => !o.userId || o.userId === user.id) : list;
  }, [raw, isAuthenticated, user]);

  if (status === 'loading') return <Spinner label={t('common.loading')} />;

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title={t('orders.emptyTitle')}
        description={t('orders.emptyText')}
        action={
          <Link to="/catalog">
            <Button>{t('orders.emptyAction')}</Button>
          </Link>
        }
      />
    );
  }

  return <OrderList orders={orders} highlightId={highlight} />;
}
