import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Rating } from '@/components/ui';
import { localized } from '@/i18n/localized.js';
import styles from './ReviewList.module.css';

export default function ReviewItem({ review }) {
  const { i18n } = useTranslation();

  return (
    <li className={styles.item}>
      <div className={styles.head}>
        <span className={styles.author}>{review.author}</span>
        <Rating value={review.rating} size="sm" showValue={false} />
        <time className={styles.date} dateTime={review.date}>
          {new Date(review.date).toLocaleDateString(i18n.language)}
        </time>
      </div>
      <p className={styles.text}>{localized(review.text, i18n.language)}</p>
    </li>
  );
}

ReviewItem.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  }).isRequired,
};
