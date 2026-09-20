import { startTransition, useActionState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '@/components/ui';
import { quickBookSchema } from '@/validation/schemas.js';
import { translateError } from '@/validation/messages.js';
import { GENRES } from '@/data/booksSeed.js';
import { formatOptions, genreOptions } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './BookForm.module.css';

const INITIAL_STATE = { status: 'idle' };

export default function AsyncBookForm({ onCreate }) {
  const { t } = useTranslation();

  const [state, formAction, isPending] = useActionState(async (previousState, payload) => {
    try {
      const created = await onCreate(payload);
      return { status: 'success', book: created };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }, INITIAL_STATE);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quickBookSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: GENRES[0],
      format: 'paper',
      price: 250,
      year: new Date().getFullYear(),
    },
  });

  const submit = handleSubmit((values) => {
    startTransition(() => formAction(values));
  });

  const error = (field) => translateError(t, errors[field]?.message);

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>{t('admin.async.title')}</h2>
      <p className={styles.panelText}>{t('admin.async.text')}</p>

      <form onSubmit={submit} noValidate>
        <div className={styles.grid2}>
          <Input
            label={t('admin.form.title')}
            required
            disabled={isPending}
            error={error('title')}
            {...register('title')}
          />
          <Input
            label={t('admin.form.author')}
            required
            disabled={isPending}
            error={error('author')}
            {...register('author')}
          />
        </div>

        <div className={styles.grid3}>
          <Select
            label={t('admin.form.genre')}
            disabled={isPending}
            options={genreOptions(t, GENRES)}
            error={error('genre')}
            {...register('genre')}
          />
          <Select
            label={t('admin.form.format')}
            disabled={isPending}
            options={formatOptions(t)}
            error={error('format')}
            {...register('format')}
          />
          <Input
            label={`${t('admin.form.price')}, ${currencySign}`}
            type="number"
            min="1"
            disabled={isPending}
            error={error('price')}
            {...register('price')}
          />
        </div>

        <div className={styles.grid2}>
          <Input
            label={t('admin.form.year')}
            type="number"
            disabled={isPending}
            error={error('year')}
            {...register('year')}
          />
        </div>

        <div className={styles.actions}>
          <Button type="submit" loading={isPending}>
            {isPending ? t('admin.async.pending') : t('admin.async.submit')}
          </Button>
        </div>
      </form>

      {state.status !== 'idle' && (
        <div className={styles.result}>
          {state.status === 'success' ? (
            <>
              <p className={styles.resultSuccess}>
                {t('admin.async.success', { title: state.book.title })}
              </p>
              <p>{t('admin.async.result')}:</p>
              <pre className={styles.pre}>{JSON.stringify(state.book, null, 2)}</pre>
            </>
          ) : (
            <p className={styles.resultError}>
              {t('admin.async.error', { message: state.message })}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

AsyncBookForm.propTypes = { onCreate: PropTypes.func.isRequired };
