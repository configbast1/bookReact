import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createBook, updateBook, deleteBook, selectBookModels } from '@/store';
import { BookForm, DataTable } from '@/components/admin';
import { Badge, Button, ConfirmDialog, Modal } from '@/components/ui';
import { useToast } from '@/context/ToastContext.jsx';
import { formatLabel, genreLabel } from '@/data/dictionaries.js';
import { currencySign } from '@/config/env.js';
import styles from './AdminPage.module.css';

export default function AdminBooksPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();

  const books = useSelector(selectBookModels);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? books.filter((book) => book.getSearchIndex().includes(query)) : books;
  }, [books, search]);

  const handleSave = async (values) => {
    if (editing === 'new') {
      await dispatch(createBook(values)).unwrap();
      toast.success(t('admin.created', { title: values.title }));
    } else {
      await dispatch(updateBook({ id: editing.id, changes: values })).unwrap();
      toast.success(t('admin.updated'));
    }
    setEditing(null);
  };

  const handleDelete = async () => {
    await dispatch(deleteBook(deleting.id)).unwrap();
    toast.success(t('admin.deleted', { title: deleting.title }));
    setDeleting(null);
  };

  const columns = [
    {
      key: 'title',
      title: t('admin.table.book'),
      render: (book) => (
        <div className={styles.bookCell}>
          <strong>{book.title}</strong>
          <span>{book.author}</span>
        </div>
      ),
    },
    { key: 'genre', title: t('admin.table.genre'), render: (book) => genreLabel(t, book.genre) },
    {
      key: 'format',
      title: t('admin.table.format'),
      render: (book) => <Badge tone="info">{formatLabel(t, book.format)}</Badge>,
    },
    {
      key: 'price',
      title: t('admin.table.price'),
      render: (book) => `${book.getFinalPrice()} ${currencySign}`,
    },
    {
      key: 'stock',
      title: t('admin.table.stock'),
      render: (book) =>
        book.format === 'paper' ? (
          <Badge tone={book.stock > 5 ? 'success' : book.stock > 0 ? 'warning' : 'danger'}>
            {book.stock}
          </Badge>
        ) : (
          <Badge tone="neutral">∞</Badge>
        ),
    },
    { key: 'rating', title: t('admin.table.rating'), render: (book) => book.rating.toFixed(1) },
    {
      key: 'actions',
      title: t('admin.table.actions'),
      render: (book) => (
        <div className={styles.rowActions}>
          <Button size="sm" variant="secondary" onClick={() => setEditing(book)}>
            {t('common.edit')}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleting(book)}>
            {t('common.delete')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          placeholder={t('admin.searchBooks')}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label={t('admin.searchBooks')}
        />
        <Button onClick={() => setEditing('new')}>{t('admin.addBook')}</Button>
      </div>

      <DataTable columns={columns} rows={filteredBooks} empty={t('admin.table.noBooks')} />

      <Modal
        open={Boolean(editing)}
        title={
          editing === 'new'
            ? t('admin.form.newTitle')
            : t('admin.form.editTitle', { title: editing?.title ?? '' })
        }
        onClose={() => setEditing(null)}
        width={760}
      >
        {editing && (
          <BookForm
            book={editing === 'new' ? null : editing}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={t('admin.deleteTitle')}
        description={t('admin.deleteText', { title: deleting?.title ?? '' })}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
