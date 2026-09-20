import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ReviewItem from './ReviewItem.jsx';
import styles from './ReviewList.module.css';

export default function ReviewList({ reviews, emptyText }) {
  const { t } = useTranslation();

  if (!reviews.length) {
    return <p className={styles.empty}>{emptyText ?? t('book.reviews.empty')}</p>;
  }

  return (
    <ul className={styles.list}>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ul>
  );
}

ReviewList.propTypes = {
  reviews: PropTypes.array.isRequired,
  emptyText: PropTypes.string,
};
