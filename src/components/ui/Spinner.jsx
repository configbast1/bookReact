import PropTypes from 'prop-types';
import styles from './Spinner.module.css';

/** Spinner — индикатор загрузки. */
export default function Spinner({ label = 'Завантаження…' }) {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

Spinner.propTypes = { label: PropTypes.string };

/** Skeleton — «скелет» карточки, пока грузятся данные (лучше пустого экрана). */
export function SkeletonGrid({ count = 8 }) {
  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonCover} />
          <div className={styles.skeletonLine} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
        </div>
      ))}
    </div>
  );
}

SkeletonGrid.propTypes = { count: PropTypes.number };
