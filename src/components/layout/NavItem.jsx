import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export default function NavItem({ to, label, icon, end = false, onNavigate }) {
  return (
    <li className={styles.navItem}>
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
        }
      >
        {icon && (
          <span className={styles.navIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        {label}
      </NavLink>
    </li>
  );
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  end: PropTypes.bool,
  onNavigate: PropTypes.func,
};
