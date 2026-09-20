import PropTypes from 'prop-types';
import BookCard from './BookCard.jsx';
import styles from './BookGrid.module.css';

export default function BookGrid({ books, compact = false }) {
  return (
    <div className={`${styles.grid} ${compact ? styles.compact : ''}`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} compact={compact} />
      ))}
    </div>
  );
}

BookGrid.propTypes = {
  books: PropTypes.array.isRequired,
  compact: PropTypes.bool,
};
