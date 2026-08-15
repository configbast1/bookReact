import PropTypes from 'prop-types';
import styles from './StatCard.module.css';

/** StatCard — плитка статистики в админ-панели. */
export default function StatCard({ label, value, hint, icon }) {
  return (
    <div className={styles.card}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {hint && <div className={styles.hint}>{hint}</div>}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  hint: PropTypes.string,
  icon: PropTypes.node,
};
