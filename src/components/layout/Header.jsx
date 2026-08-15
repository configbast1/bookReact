import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/context/ThemeContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { useCart } from '@/hooks';
import { setFilter } from '@/store';
import { Button } from '@/components/ui';
import styles from './Header.module.css';

/**
 * Header — шапка сайта: логотип, навигация, поиск, тема, корзина, профиль.
 * На мобильных превращается в бургер-меню.
 */
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    dispatch(setFilter({ key: 'search', value: query }));
    setMenuOpen(false);
    navigate('/catalog');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark} aria-hidden="true">📖</span>
          <span className={styles.logoText}>Книгарня</span>
        </Link>

        <form className={styles.search} onSubmit={handleSearch} role="search">
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Пошук книг, авторів…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Пошук по каталогу"
          />
          <button type="submit" className={styles.searchButton} aria-label="Знайти">
            🔍
          </button>
        </form>

        <button
          type="button"
          className={styles.burger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink to="/catalog" className={navClass} onClick={closeMenu}>
            Каталог
          </NavLink>
          <NavLink to="/orders" className={navClass} onClick={closeMenu}>
            Замовлення
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navClass} onClick={closeMenu}>
              Адмінка
            </NavLink>
          )}

          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Світла тема' : 'Темна тема'}
            title={theme === 'dark' ? 'Світла тема' : 'Темна тема'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <NavLink to="/cart" className={styles.cartLink} onClick={closeMenu} aria-label="Кошик">
            <span aria-hidden="true">🛒</span>
            <span className={styles.cartText}>Кошик</span>
            {count > 0 && <span className={styles.cartBadge}>{count}</span>}
          </NavLink>

          {isAuthenticated ? (
            <div className={styles.profile}>
              <span className={styles.avatar} title={user.getDisplayName()}>
                {user.getInitials()}
              </span>
              <Button variant="ghost" size="sm" onClick={() => { logout(); closeMenu(); }}>
                Вийти
              </Button>
            </div>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              <Button size="sm">Увійти</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

/** Функция-класс для NavLink: активный пункт подсвечивается. */
function navClass({ isActive }) {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}
