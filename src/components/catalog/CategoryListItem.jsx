import PropTypes from 'prop-types';
import styles from './CategoryList.module.css';

export default function CategoryListItem({ value, label, count, active, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className={active ? styles.itemActive : styles.item}
        onClick={() => onSelect(value)}
        aria-current={active ? 'true' : undefined}
      >
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>{count}</span>
      </button>
    </li>
  );
}

CategoryListItem.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  active: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};
