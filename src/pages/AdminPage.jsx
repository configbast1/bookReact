import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchOrders, selectOrdersError, selectOrdersStatus } from '@/store';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useAuth();

  const ordersStatus = useSelector(selectOrdersStatus);
  const ordersError = useSelector(selectOrdersError);

  useEffect(() => {
    if (ordersStatus === 'idle') dispatch(fetchOrders());
  }, [ordersStatus, dispatch]);

  useEffect(() => {
    if (ordersError) toast.error(ordersError);
  }, [ordersError, toast]);

  const tabs = [
    { to: '/admin', label: `📊 ${t('admin.stats')}`, end: true },
    { to: '/admin/books', label: `📚 ${t('admin.books')}` },
    { to: '/admin/orders', label: `📦 ${t('admin.orders')}` },
    { to: '/admin/quick-add', label: `⚡ ${t('admin.asyncForm')}` },
    { to: '/admin/formik', label: `🧩 ${t('admin.formikForm')}` },
  ];

  return (
    <div className="container page">
      <div className="pageHeader">
        <div>
          <h1>{t('admin.title')}</h1>
          <p className={styles.subtitle}>{t('admin.welcome', { name: user.getDisplayName() })}</p>
        </div>
      </div>

      <nav className={styles.tabs}>
        <ul className={styles.tabList}>
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                end={tab.end}
                className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
