import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { reviewSchema } from '@/validation/schemas.js';
import { translateError } from '@/validation/messages.js';
import styles from './ReviewList.module.css';

const RATINGS = [5, 4, 3, 2, 1];

export default function ReviewForm({ onSubmit, defaultAuthor = '' }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { author: defaultAuthor, rating: 5, text: '' },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, rating: Number(values.rating) });
    reset({ author: values.author, rating: 5, text: '' });
  });

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.formRow}>
        <Input
          label={t('book.reviews.author')}
          required
          error={translateError(t, errors.author?.message)}
          {...register('author')}
        />
        <Select
          label={t('book.reviews.rating')}
          options={RATINGS.map((value) => ({ value, label: '★'.repeat(value) }))}
          error={translateError(t, errors.rating?.message)}
          {...register('rating')}
        />
      </div>

      <Textarea
        label={t('book.reviews.text')}
        required
        rows={3}
        error={translateError(t, errors.text?.message)}
        {...register('text')}
      />

      <div className={styles.formActions}>
        <Button type="submit" loading={isSubmitting}>
          {t('book.reviews.submit')}
        </Button>
      </div>
    </form>
  );
}

ReviewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaultAuthor: PropTypes.string,
};
