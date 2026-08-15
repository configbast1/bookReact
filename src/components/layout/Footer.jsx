import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

/** Footer — подвал сайта. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <h4 className={styles.title}>📖 Книгарня</h4>
          <p className={styles.text}>
            Навчальний проєкт інтернет-магазину книг на React: ООП-моделі,
            Redux Toolkit, Context API та адаптивна верстка.
          </p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>Розділи</h4>
          <Link to="/catalog">Каталог</Link>
          <Link to="/cart">Кошик</Link>
          <Link to="/orders">Мої замовлення</Link>
        </div>

        <div className={styles.col}>
          <h4 className={styles.title}>Демо-доступи</h4>
          <span className={styles.text}>Адмін: admin@book.ua / admin123</span>
          <span className={styles.text}>Покупець: user@book.ua / user123</span>
          <span className={styles.text}>Промокоди: BOOK10, READMORE, STUDENT</span>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Книгарня — навчальний проєкт</span>
      </div>
    </footer>
  );
}
