import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Badge, Button, Rating } from '@/components/ui';
import { ReviewForm, ReviewList } from '@/components/reviews';
import { localized } from '@/i18n/localized.js';
import styles from './FavoriteList.module.css';

export default function FavoriteCard({ favorite, onAddReview }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const averageRating = favorite.reviews.length
    ? favorite.reviews.reduce((sum, review) => sum + review.rating, 0) / favorite.reviews.length
    : favorite.myRating;

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.title}>{favorite.title}</h3>
          <p className={styles.author}>{favorite.author}</p>
        </div>
        <Badge tone="accent">{t(`genre.${favorite.genreKey}`)}</Badge>
      </header>

      <p className={styles.description}>{localized(favorite.description, i18n.language)}</p>

      <dl className={styles.meta}>
        <div>
          <dt>{t('favorites.year')}</dt>
          <dd>{favorite.year}</dd>
        </div>
        <div>
          <dt>{t('favorites.pages')}</dt>
          <dd>{favorite.pages}</dd>
        </div>
        <div>
          <dt>{t('favorites.myRating')}</dt>
          <dd>
            <Rating value={averageRating} size="sm" />
          </dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <span className={styles.count}>
          {t('favorites.reviewsCount', { count: favorite.reviews.length })}
        </span>
        <Button size="sm" variant="secondary" onClick={() => setOpen((prev) => !prev)}>
          {open ? t('favorites.hide') : t('favorites.show')}
        </Button>
      </div>

      {open && (
        <div className={styles.reviews}>
          <ReviewList reviews={favorite.reviews} emptyText={t('favorites.empty')} />
          <ReviewForm onSubmit={(review) => onAddReview(favorite.id, review)} />
        </div>
      )}
    </article>
  );
}

FavoriteCard.propTypes = {
  favorite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    genreKey: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    myRating: PropTypes.number.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    reviews: PropTypes.array.isRequired,
  }).isRequired,
  onAddReview: PropTypes.func.isRequired,
};
