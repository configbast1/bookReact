import PropTypes from 'prop-types';
import styles from './Button.module.css';

/**
 * Button — базовая кнопка приложения.
 * Пример работы с props: variant, size, loading, fullWidth,
 * плюс ...rest, чтобы прокинуть любые нативные атрибуты.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon = null,
  className = '',
  disabled = false,
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
    loading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// PropTypes — контракт компонента: какие пропсы он принимает и какого типа.
Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
