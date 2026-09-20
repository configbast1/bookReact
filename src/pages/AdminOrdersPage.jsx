import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { changeOrderStatus, selectOrders } from '@/store';
import { Order } from '@/core/models';
import { DataTable } from '@/components/admin';
import { Badge, Select } from '@/components/ui';
import { currencySign } from '@/config/env.js';
import styles from './AdminPage.module.css';

const STATUS_TONE = {
  new: 'info',
  processing: 'warning',
  shipped: 'accent',
  done: 'success',
  cancelled: 'danger',
};

export default function AdminOrdersPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const rawOrders = useSelector(selectOrders);

  const orders = useMemo(() => rawOrders.map((item) => new Order(item)), [rawOrders]);

  const columns = [
    {
      key: 'id',
      title: t('admin.table.order'),
      render: (order) => t('orders.number', { number: order.id.slice(-6).toUpperCase() }),
    },
    {
      key: 'customer',
      title: t('admin.table.customer'),
      render: (order) => (
        <div className={styles.bookCell}>
          <strong>{order.customer.name}</strong>
          <span>{order.customer.phone}</span>
        </div>
      ),
    },
    { key: 'items', title: t('admin.table.positions'), render: (order) => order.itemsCount },
    {
      key: 'total',
      title: t('admin.table.sum'),
      render: (order) => `${order.total} ${currencySign}`,
    },
    {
      key: 'date',
      title: t('admin.table.date'),
      render: (order) => order.createdAt.toLocaleDateString(i18n.language),
    },
    {
      key: 'status',
      title: t('admin.table.status'),
      render: (order) => (
        <Badge tone={STATUS_TONE[order.status]}>{t(`orders.status.${order.status}`)}</Badge>
      ),
    },
    {
      key: 'change',
      title: t('admin.table.changeStatus'),
      render: (order) => {
        const allowed = Order.TRANSITIONS[order.status] ?? [];
        if (!allowed.length) return <span className={styles.muted}>—</span>;

        return (
          <Select
            className={styles.statusSelect}
            value=""
            onChange={(event) =>
              event.target.value &&
              dispatch(changeOrderStatus({ id: order.id, status: event.target.value }))
            }
            options={[
              { value: '', label: t('admin.table.choose') },
              ...allowed.map((status) => ({ value: status, label: t(`orders.status.${status}`) })),
            ]}
          />
        );
      },
    },
  ];

  return <DataTable columns={columns} rows={orders} empty={t('admin.table.noOrders')} />;
}
