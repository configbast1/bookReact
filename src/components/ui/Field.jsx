import PropTypes from 'prop-types';
import { useId } from 'react';
import styles from './Field.module.css';

/**
 * Обёртка поля: label + контрол + текст ошибки.
 * Связывает подпись и поле через id (доступность),
 * выставляет aria-invalid и aria-describedby для скринридеров.
 */
function FieldWrapper({ label, error, hint, required, children, id }) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required} aria-hidden="true"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
}

FieldWrapper.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  children: PropTypes.node,
  id: PropTypes.string,
};

/** Текстовое поле. */
export function Input({ label, error, hint, required, className = '', ...rest }) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={id}>
      <input
        id={id}
        className={`${styles.control} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldWrapper>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

/** Выпадающий список. */
export function Select({ label, error, hint, required, options = [], className = '', ...rest }) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={id}>
      <select
        id={id}
        className={`${styles.control} ${styles.select} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.string }),
  ),
};

/** Многострочное поле. */
export function Textarea({ label, error, hint, required, className = '', ...rest }) {
  const id = useId();
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} id={id}>
      <textarea
        id={id}
        rows={4}
        className={`${styles.control} ${styles.textarea} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </FieldWrapper>
  );
}

Textarea.propTypes = Input.propTypes;

/** Чекбокс с подписью. */
export function Checkbox({ label, className = '', ...rest }) {
  const id = useId();
  return (
    <label className={`${styles.checkbox} ${className}`} htmlFor={id}>
      <input id={id} type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}

Checkbox.propTypes = { label: PropTypes.node, className: PropTypes.string };
