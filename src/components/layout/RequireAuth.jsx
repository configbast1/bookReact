import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { Spinner } from '@/components/ui';

/**
 * RequireAuth — защита маршрута.
 * Не пускает неавторизованных, а при adminOnly — и обычных покупателей.
 * Пример компонента-обёртки (HOC-подход через children).
 */
export default function RequireAuth({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner label="Перевіряємо доступ…" />;

  if (!isAuthenticated) {
    // Запоминаем, куда пользователь хотел попасть, чтобы вернуть после входа.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.node,
  adminOnly: PropTypes.bool,
};
