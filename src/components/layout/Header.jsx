import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useCart } from '@/hooks';
import { setFilter } from '@/store';
import { Button } from '@/components/ui';
import env from '@/config/env.js';
import NavList from './NavList.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import styles from './Header.module.css';

export default function Header() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const navItems = useMemo(() => {
    const items = [
      { to: '/catalog', label: t('nav.catalog'), icon: '📚' },
      { to: '/favorites', label: t('nav.favorites'), icon: '⭐' },
      { to: '/about-me', label: t('nav.about'), icon: '🙋' },
      { to: '/account/orders', label: t('nav.orders'), icon: '📦' },
    ];

    if (isAdmin) items.push({ to: '/admin', label: t('nav.admin'), icon: '🛠' });

    return items;
  }, [t, isAdmin]);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (event) => {
    event.preventDefault();
    dispatch(setFilter({ key: 'search', value: query }));
    closeMenu();
    navigate('/catalog');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark} aria-hidden="true">
            📖
          </span>
          <span className={styles.logoText}>{env.appName}</span>
        </Link>

        <form className={styles.search} onSubmit={handleSearch} role="search">
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t('nav.searchPlaceholder')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('nav.searchLabel')}
          />
          <button type="submit" className={styles.searchButton} aria-label={t('common.search')}>
            🔍
          </button>
        </form>

        <button
          type="button"
          className={styles.burger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label={t('nav.menu')}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavList items={navItems} onNavigate={closeMenu} ariaLabel={t('nav.menu')} />

          <LanguageSwitcher />

          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
            title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link to="/cart" className={styles.cartLink} onClick={closeMenu} aria-label={t('nav.cart')}>
            <span aria-hidden="true">🛒</span>
            <span className={styles.cartText}>{t('nav.cart')}</span>
            {count > 0 && <span className={styles.cartBadge}>{count}</span>}
          </Link>

          {isAuthenticated ? (
            <div className={styles.profile}>
              <Link
                to="/account/profile"
                className={styles.avatar}
                title={user.getDisplayName()}
                onClick={closeMenu}
              >
                {user.getInitials()}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                {t('nav.logout')}
              </Button>
            </div>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              <Button size="sm">{t('nav.login')}</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
