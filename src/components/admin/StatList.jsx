import PropTypes from 'prop-types';
import StatCard from './StatCard.jsx';
import styles from './StatCard.module.css';

export default function StatList({ stats }) {
  return (
    <div className={styles.list}>
      {stats.map((stat) => (
        <StatCard
          key={stat.key}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          hint={stat.hint}
        />
      ))}
    </div>
  );
}

StatList.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      icon: PropTypes.node,
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
      hint: PropTypes.string,
    }),
  ).isRequired,
};
