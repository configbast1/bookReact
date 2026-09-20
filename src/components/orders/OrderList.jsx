import PropTypes from 'prop-types';
import OrderCard from './OrderCard.jsx';
import styles from './OrderList.module.css';

export default function OrderList({ orders, highlightId = null }) {
  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} highlighted={order.id === highlightId} />
      ))}
    </div>
  );
}

OrderList.propTypes = {
  orders: PropTypes.array.isRequired,
  highlightId: PropTypes.string,
};
