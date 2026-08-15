import PropTypes from 'prop-types';
import styles from './Pagination.module.css';

/** Pagination — постраничная навигация с сокращением («1 … 4 5 6 … 12»). */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    const isEdge = i === 1 || i === totalPages;
    const isNear = Math.abs(i - page) <= 1;
    if (isEdge || isNear) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <nav className={styles.pagination} aria-label="Сторінки каталогу">
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Попередня сторінка"
      >
        ‹
      </button>

      {pages.map((p, index) =>
        p === '…' ? (
          <span key={`gap-${index}`} className={styles.gap}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            className={`${styles.page} ${p === page ? styles.active : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Наступна сторінка"
      >
        ›
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
