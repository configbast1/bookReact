import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { bookSchema } from '@/validation/schemas.js';
import { translateError } from '@/validation/messages.js';
import { GENRES } from '@/data/booksSeed.js';
import { formatOptions, genreOptions } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './BookForm.module.css';

export default function BookForm({ book = null, onSubmit, onCancel }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title ?? '',
      author: book?.author ?? '',
      genre: book?.genre ?? GENRES[0],
      format: book?.format ?? 'paper',
      price: book?.price ?? 100,
      year: book?.year ?? new Date().getFullYear(),
      stock: book?.stock ?? 0,
      pages: book?.pages ?? 0,
      isbn: book?.isbn ?? '',
      rating: book?.rating ?? 0,
      description: book?.description ?? '',
      cover: book?.cover ?? 'soft',
      fileFormat: book?.fileFormat ?? 'pdf',
      narrator: book?.narrator ?? '',
      durationMin: book?.durationMin ?? 300,
    },
  });

  const format = watch('format');
  const error = (field) => translateError(t, errors[field]?.message);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.grid2}>
        <Input label={t('admin.form.title')} required error={error('title')} {...register('title')} />
        <Input
          label={t('admin.form.author')}
          required
          error={error('author')}
          {...register('author')}
        />
      </div>

      <div className={styles.grid3}>
        <Select
          label={t('admin.form.genre')}
          required
          options={genreOptions(t, GENRES)}
          error={error('genre')}
          {...register('genre')}
        />
        <Select
          label={t('admin.form.format')}
          required
          options={formatOptions(t)}
          error={error('format')}
          {...register('format')}
        />
        <Input
          label={`${t('admin.form.price')}, ${currencySign}`}
          type="number"
          min="1"
          required
          error={error('price')}
          {...register('price')}
        />
      </div>

      <div className={styles.grid3}>
        <Input
          label={t('admin.form.year')}
          type="number"
          required
          error={error('year')}
          {...register('year')}
        />
        <Input
          label={t('admin.form.stock')}
          type="number"
          min="0"
          disabled={format !== 'paper'}
          hint={format !== 'paper' ? t('admin.form.stockHint') : undefined}
          error={error('stock')}
          {...register('stock')}
        />
        <Input
          label={t('admin.form.pages')}
          type="number"
          min="0"
          error={error('pages')}
          {...register('pages')}
        />
      </div>

      <div className={styles.grid2}>
        <Input
          label={t('admin.form.isbn')}
          placeholder="978-617-09-0000-0"
          error={error('isbn')}
          {...register('isbn')}
        />
        <Input
          label={t('admin.form.rating')}
          type="number"
          step="0.1"
          min="0"
          max="5"
          error={error('rating')}
          {...register('rating')}
        />
      </div>

      {format === 'paper' && (
        <Select
          label={t('admin.form.cover')}
          options={[
            { value: 'soft', label: t('admin.form.coverSoft') },
            { value: 'hard', label: t('admin.form.coverHard') },
          ]}
          error={error('cover')}
          {...register('cover')}
        />
      )}

      {format === 'ebook' && (
        <Select
          label={t('admin.form.fileFormat')}
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'epub', label: 'EPUB' },
            { value: 'fb2', label: 'FB2' },
          ]}
          error={error('fileFormat')}
          {...register('fileFormat')}
        />
      )}

      {format === 'audio' && (
        <div className={styles.grid2}>
          <Input
            label={t('admin.form.narrator')}
            error={error('narrator')}
            {...register('narrator')}
          />
          <Input
            label={t('admin.form.duration')}
            type="number"
            min="1"
            error={error('durationMin')}
            {...register('durationMin')}
          />
        </div>
      )}

      <Textarea
        label={t('admin.form.description')}
        error={error('description')}
        {...register('description')}
      />

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {book ? t('admin.form.submitEdit') : t('admin.form.submitNew')}
        </Button>
      </div>
    </form>
  );
}

BookForm.propTypes = {
  book: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
