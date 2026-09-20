import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import env from '@/config/env.js';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { to: '/catalog', label: t('nav.catalog') },
    { to: '/favorites', label: t('nav.favorites') },
    { to: '/cart', label: t('nav.cart') },
    { to: '/account/orders', label: t('nav.orders') },
    { to: '/about-me', label: t('nav.about') },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <h4 className={styles.title}>📖 {env.appName}</h4>
          <p className={styles.text}>{t('home.heroText')}</p>
          <p className={styles.text}>{env.supportEmail}</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>{t('nav.menu')}</h4>
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>{t('login.demoTitle')}</h4>
          <span className={styles.text}>{t('login.demoAdmin')}</span>
          <span className={styles.text}>{t('login.demoUser')}</span>
          <span className={styles.text}>{t('summary.promoHint')}</span>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>
          © {new Date().getFullYear()} {env.appName}
        </span>
      </div>
    </footer>
  );
}
