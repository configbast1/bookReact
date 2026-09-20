import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FavoriteList } from '@/components/favorites';
import { favoritesSeed } from '@/data/favoritesSeed.js';
import { useToast } from '@/context/ToastContext.jsx';
import styles from './FavoritesPage.module.css';

function createId() {
  return `rv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [favorites, setFavorites] = useState(favoritesSeed);

  const handleAddReview = useCallback(
    (favoriteId, review) => {
      const entry = {
        id: createId(),
        author: review.author,
        rating: Number(review.rating),
        text: review.text,
        date: new Date().toISOString().slice(0, 10),
      };

      setFavorites((previous) =>
        previous.map((favorite) =>
          favorite.id === favoriteId
            ? { ...favorite, reviews: [entry, ...favorite.reviews] }
            : favorite,
        ),
      );

      toast.success(t('book.reviews.added'));
    },
    [toast, t],
  );

  const totalReviews = favorites.reduce((sum, favorite) => sum + favorite.reviews.length, 0);

  return (
    <div className="container page">
      <div className="pageHeader">
        <div>
          <h1>{t('favorites.title')}</h1>
          <p className={styles.subtitle}>{t('favorites.subtitle')}</p>
        </div>
        <span className={styles.counter}>{t('favorites.reviewsCount', { count: totalReviews })}</span>
      </div>

      <FavoriteList favorites={favorites} onAddReview={handleAddReview} />
    </div>
  );
}
