import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onChange }) {
  const { t } = useTranslation();

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
    <nav className={styles.pagination} aria-label={t('catalog.title')}>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label={t('common.back')}
      >
        ‹
      </button>

      {pages.map((value, index) =>
        value === '…' ? (
          <span key={`gap-${index}`} className={styles.gap}>
            …
          </span>
        ) : (
          <button
            key={value}
            type="button"
            className={`${styles.page} ${value === page ? styles.active : ''}`}
            onClick={() => onChange(value)}
            aria-current={value === page ? 'page' : undefined}
          >
            {value}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.arrow}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label={t('home.seeAll')}
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
