import { useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '@/core/storage';
import { reviewsSeed } from '@/data/reviewsSeed.js';
import usePersistentState from './usePersistentState.js';

function createId() {
  return `rv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function useReviews(bookId) {
  const [stored, setStored] = usePersistentState(STORAGE_KEYS.REVIEWS, {});

  const reviews = useMemo(() => {
    const seeded = reviewsSeed[bookId] ?? [];
    const added = stored[bookId] ?? [];
    return [...added, ...seeded];
  }, [bookId, stored]);

  const addReview = useCallback(
    (review) => {
      const entry = {
        id: createId(),
        author: review.author,
        rating: Number(review.rating),
        text: review.text,
        date: new Date().toISOString().slice(0, 10),
      };

      setStored((previous) => ({
        ...previous,
        [bookId]: [entry, ...(previous[bookId] ?? [])],
      }));

      return entry;
    },
    [bookId, setStored],
  );

  return { reviews, addReview };
}
