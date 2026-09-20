import PropTypes from 'prop-types';
import NavItem from './NavItem.jsx';
import styles from './Header.module.css';

export default function NavList({ items, onNavigate, ariaLabel }) {
  return (
    <ul className={styles.navList} aria-label={ariaLabel}>
      {items.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          label={item.label}
          icon={item.icon}
          end={item.end}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}

NavList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      end: PropTypes.bool,
    }),
  ).isRequired,
  onNavigate: PropTypes.func,
  ariaLabel: PropTypes.string,
};
