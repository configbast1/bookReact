import PropTypes from 'prop-types';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '📚', title, description, action }) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon} aria-hidden="true">{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};
