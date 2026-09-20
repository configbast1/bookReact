import PropTypes from 'prop-types';
import styles from './Rating.module.css';

const STARS = [1, 2, 3, 4, 5];

export default function Rating({ value = 0, count = null, size = 'md', showValue = true }) {
  return (
    <span
      className={`${styles.rating} ${styles[size]}`}
      title={`${value.toFixed(1)} / 5`}
      aria-label={`${value.toFixed(1)} / 5`}
    >
      <span className={styles.stars} aria-hidden="true">
        {STARS.map((star) => {
          const fill = Math.max(0, Math.min(1, value - star + 1)) * 100;
          return (
            <span key={star} className={styles.star}>
              <span className={styles.starBg}>★</span>
              <span className={styles.starFill} style={{ width: `${fill}%` }}>
                ★
              </span>
            </span>
          );
        })}
      </span>
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
      {count !== null && <span className={styles.count}>({count})</span>}
    </span>
  );
}

Rating.propTypes = {
  value: PropTypes.number,
  count: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md']),
  showValue: PropTypes.bool,
};
