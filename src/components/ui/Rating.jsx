import PropTypes from 'prop-types';
import styles from './Rating.module.css';

/** Rating — звёзды рейтинга с поддержкой половинок. */
export default function Rating({ value = 0, count = null, size = 'md', showValue = true }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <span
      className={`${styles.rating} ${styles[size]}`}
      title={`Рейтинг ${value} з 5`}
      aria-label={`Рейтинг ${value} з 5`}
    >
      <span className={styles.stars} aria-hidden="true">
        {stars.map((star) => {
          const fill = Math.max(0, Math.min(1, value - star + 1)) * 100;
          return (
            <span key={star} className={styles.star}>
              <span className={styles.starBg}>★</span>
              <span className={styles.starFill} style={{ width: `${fill}%` }}>★</span>
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
