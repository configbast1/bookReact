import PropTypes from 'prop-types';
import styles from './Badge.module.css';

export default function Badge({ children, tone = 'neutral', className = '' }) {
  return <span className={`${styles.badge} ${styles[tone]} ${className}`}>{children}</span>;
}

Badge.propTypes = {
  children: PropTypes.node,
  tone: PropTypes.oneOf(['neutral', 'accent', 'success', 'danger', 'warning', 'info']),
  className: PropTypes.string,
};
