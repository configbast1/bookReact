import PropTypes from 'prop-types';
import FavoriteCard from './FavoriteCard.jsx';
import styles from './FavoriteList.module.css';

export default function FavoriteList({ favorites, onAddReview }) {
  return (
    <div className={styles.list}>
      {favorites.map((favorite) => (
        <FavoriteCard key={favorite.id} favorite={favorite} onAddReview={onAddReview} />
      ))}
    </div>
  );
}

FavoriteList.propTypes = {
  favorites: PropTypes.array.isRequired,
  onAddReview: PropTypes.func.isRequired,
};
