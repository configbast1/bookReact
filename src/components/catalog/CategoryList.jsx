import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CategoryListItem from './CategoryListItem.jsx';
import styles from './CategoryList.module.css';

export default function CategoryList({ categories, active, onSelect }) {
  const { t } = useTranslation();

  return (
    <nav className={styles.wrap} aria-label={t('catalog.categories')}>
      <h3 className={styles.heading}>{t('catalog.categories')}</h3>

      <ul className={styles.list}>
        {categories.map((category) => (
          <CategoryListItem
            key={category.value}
            value={category.value}
            label={category.label}
            count={category.count}
            active={category.value === active}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </nav>
  );
}

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  active: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
