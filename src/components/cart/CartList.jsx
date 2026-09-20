import PropTypes from 'prop-types';
import CartItemRow from './CartItemRow.jsx';
import styles from './CartList.module.css';

export default function CartList({ items }) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <CartItemRow key={item.book.id} item={item} />
      ))}
    </div>
  );
}

CartList.propTypes = { items: PropTypes.array.isRequired };
