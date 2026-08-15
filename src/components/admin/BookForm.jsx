import PropTypes from 'prop-types';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { useForm } from '@/hooks';
import { bookSchema } from '@/core/validation';
import { FORMATS, GENRES } from '@/data/booksSeed.js';
import styles from './BookForm.module.css';

/**
 * BookForm — форма добавления/редактирования книги.
 * Одна форма на два сценария: если передан book — режим редактирования.
 * Валидация — та же ООП-схема bookSchema.
 */
export default function BookForm({ book = null, onSubmit, onCancel }) {
  const form = useForm(
    {
      title: book?.title ?? '',
      author: book?.author ?? '',
      genre: book?.genre ?? GENRES[0],
      format: book?.format ?? 'paper',
      price: book?.price ?? '',
      year: book?.year ?? new Date().getFullYear(),
      stock: book?.stock ?? 0,
      pages: book?.pages ?? 0,
      isbn: book?.isbn ?? '',
      rating: book?.rating ?? 0,
      description: book?.description ?? '',
      // поля конкретных подклассов
      cover: book?.cover ?? 'soft',
      fileFormat: book?.fileFormat ?? 'pdf',
      narrator: book?.narrator ?? '',
      durationMin: book?.durationMin ?? 300,
    },
    bookSchema,
    async (values) => {
      // Приводим строки из input к числам перед сохранением.
      await onSubmit({
        ...values,
        price: Number(values.price),
        year: Number(values.year),
        stock: Number(values.stock),
        pages: Number(values.pages),
        rating: Number(values.rating),
        durationMin: Number(values.durationMin),
      });
    },
  );

  const format = form.values.format;

  return (
    <form onSubmit={form.handleSubmit} noValidate>
      <div className={styles.grid2}>
        <Input label="Назва" required {...form.fieldProps('title')} />
        <Input label="Автор" required {...form.fieldProps('author')} />
      </div>

      <div className={styles.grid3}>
        <Select
          label="Жанр"
          required
          options={GENRES.map((g) => ({ value: g, label: g }))}
          {...form.fieldProps('genre')}
        />
        <Select
          label="Формат"
          required
          options={FORMATS.map((f) => ({ value: f.value, label: f.label }))}
          {...form.fieldProps('format')}
        />
        <Input label="Ціна, ₴" type="number" min="1" required {...form.fieldProps('price')} />
      </div>

      <div className={styles.grid3}>
        <Input label="Рік" type="number" required {...form.fieldProps('year')} />
        <Input
          label="На складі"
          type="number"
          min="0"
          disabled={format !== 'paper'}
          hint={format !== 'paper' ? 'Цифровий товар — необмежено' : undefined}
          {...form.fieldProps('stock')}
        />
        <Input label="Сторінок" type="number" min="0" {...form.fieldProps('pages')} />
      </div>

      <div className={styles.grid2}>
        <Input label="ISBN" placeholder="978-617-09-0000-0" {...form.fieldProps('isbn')} />
        <Input label="Рейтинг (0–5)" type="number" step="0.1" min="0" max="5" {...form.fieldProps('rating')} />
      </div>

      {/* Поля, специфичные для конкретного класса книги */}
      {format === 'paper' && (
        <Select
          label="Обкладинка"
          options={[
            { value: 'soft', label: 'Мʼяка' },
            { value: 'hard', label: 'Тверда' },
          ]}
          {...form.fieldProps('cover')}
        />
      )}

      {format === 'ebook' && (
        <Select
          label="Формат файлу"
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'epub', label: 'EPUB' },
            { value: 'fb2', label: 'FB2' },
          ]}
          {...form.fieldProps('fileFormat')}
        />
      )}

      {format === 'audio' && (
        <div className={styles.grid2}>
          <Input label="Диктор" {...form.fieldProps('narrator')} />
          <Input label="Тривалість, хв" type="number" min="1" {...form.fieldProps('durationMin')} />
        </div>
      )}

      <Textarea label="Опис" {...form.fieldProps('description')} />

      {form.submitError && <p className={styles.error}>{form.submitError}</p>}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>Скасувати</Button>
        <Button type="submit" loading={form.submitting}>
          {book ? 'Зберегти зміни' : 'Додати книгу'}
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
