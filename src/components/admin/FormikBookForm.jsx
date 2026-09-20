import { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '@/components/ui';
import { quickBookYupSchema } from '@/validation/yupSchemas.js';
import { translateError } from '@/validation/messages.js';
import { GENRES } from '@/data/booksSeed.js';
import { formatOptions, genreOptions } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './BookForm.module.css';

export default function FormikBookForm({ onCreate }) {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>{t('admin.formik.title')}</h2>
      <p className={styles.panelText}>{t('admin.formik.text')}</p>

      <Formik
        initialValues={{
          title: '',
          author: '',
          genre: GENRES[0],
          format: 'paper',
          price: 250,
          year: new Date().getFullYear(),
        }}
        validationSchema={quickBookYupSchema}
        onSubmit={async (values, helpers) => {
          try {
            const created = await onCreate(values);
            setResult({ status: 'success', book: created });
            helpers.resetForm();
          } catch (error) {
            setResult({ status: 'error', message: error.message });
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => {
          const error = (field) =>
            touched[field] ? translateError(t, errors[field]) : null;

          const field = (name) => ({
            name,
            value: values[name],
            onChange: handleChange,
            onBlur: handleBlur,
            error: error(name),
          });

          return (
            <Form noValidate>
              <div className={styles.grid2}>
                <Input label={t('admin.form.title')} required {...field('title')} />
                <Input label={t('admin.form.author')} required {...field('author')} />
              </div>

              <div className={styles.grid3}>
                <Select
                  label={t('admin.form.genre')}
                  options={genreOptions(t, GENRES)}
                  {...field('genre')}
                />
                <Select
                  label={t('admin.form.format')}
                  options={formatOptions(t)}
                  {...field('format')}
                />
                <Input
                  label={`${t('admin.form.price')}, ${currencySign}`}
                  type="number"
                  min="1"
                  {...field('price')}
                />
              </div>

              <div className={styles.grid2}>
                <Input label={t('admin.form.year')} type="number" {...field('year')} />
              </div>

              <div className={styles.actions}>
                <Button type="submit" loading={isSubmitting}>
                  {t('admin.async.submit')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {result && (
        <div className={styles.result}>
          {result.status === 'success' ? (
            <>
              <p className={styles.resultSuccess}>
                {t('admin.async.success', { title: result.book.title })}
              </p>
              <pre className={styles.pre}>{JSON.stringify(result.book, null, 2)}</pre>
            </>
          ) : (
            <p className={styles.resultError}>
              {t('admin.async.error', { message: result.message })}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

FormikBookForm.propTypes = { onCreate: PropTypes.func.isRequired };
