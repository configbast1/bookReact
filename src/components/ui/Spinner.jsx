import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './Spinner.module.css';

export default function Spinner({ label }) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrap} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label ?? t('common.loading')}</span>
    </div>
  );
}

Spinner.propTypes = { label: PropTypes.string };

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div className={styles.skeletonCover} />
          <div className={styles.skeletonLine} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
        </div>
      ))}
    </div>
  );
}

SkeletonGrid.propTypes = { count: PropTypes.number };
