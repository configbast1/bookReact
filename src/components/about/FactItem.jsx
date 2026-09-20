import PropTypes from 'prop-types';
import styles from './FactList.module.css';

function renderValue(value) {
  if (Array.isArray(value)) {
    return (
      <ul className={styles.tags}>
        {value.map((entry) => (
          <li key={String(entry)} className={styles.tag}>
            {String(entry)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'boolean') return value ? '✅' : '❌';

  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        {value}
      </a>
    );
  }

  return String(value);
}

export default function FactItem({ label, value }) {
  return (
    <div className={styles.item}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{renderValue(value)}</dd>
    </div>
  );
}

FactItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};
