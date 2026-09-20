import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext.jsx';
import styles from './AccountPage.module.css';

export default function AccountPage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const tabs = [
    { to: '/account/profile', label: t('account.profile') },
    { to: '/account/orders', label: t('account.orders') },
    { to: '/account/settings', label: t('account.settings') },
  ];

  return (
    <div className="container page">
      <div className="pageHeader">
        <div>
          <h1>{t('account.title')}</h1>
          {isAuthenticated && <p className={styles.subtitle}>{user.getDisplayName()}</p>}
        </div>
      </div>

      <nav className={styles.tabs}>
        <ul className={styles.tabList}>
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) => (isActive ? styles.tabActive : styles.tab)}
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
