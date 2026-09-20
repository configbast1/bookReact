import PropTypes from 'prop-types';
import styles from './BookCover.module.css';

const PALETTE = [
  ['#8a5a2b', '#c89b6a'],
  ['#2f5d62', '#7fb2a6'],
  ['#5b3e75', '#a281bd'],
  ['#7a2f3d', '#c1748a'],
  ['#3b5a8c', '#89a9d6'],
  ['#4a5f2c', '#9db86f'],
  ['#8c5a12', '#d6a75a'],
];

function hashIndex(text, modulo) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash % modulo;
}

export default function BookCover({ book, size = 'md' }) {
  const [from, to] = PALETTE[hashIndex(book.title, PALETTE.length)];

  return (
    <div
      className={`${styles.cover} ${styles[size]}`}
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
      role="img"
      aria-label={`Обкладинка книги ${book.title}`}
    >
      <span className={styles.spine} aria-hidden="true" />
      <span className={styles.title}>{book.title}</span>
      <span className={styles.author}>{book.author}</span>
    </div>
  );
}

BookCover.propTypes = {
  book: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
