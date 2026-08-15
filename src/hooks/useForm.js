import { useCallback, useState } from 'react';

/**
 * useForm — универсальный хук формы.
 * Работает в паре с ValidationSchema из ООП-ядра:
 * хук отвечает за состояние и UX, схема — за правила.
 *
 * @param {object} initialValues начальные значения
 * @param {ValidationSchema} schema схема валидации
 * @param {(values) => Promise|void} onSubmit обработчик отправки
 */
export default function useForm(initialValues, schema, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /** Изменение поля. Ошибку показываем только если поле уже «трогали». */
  const handleChange = useCallback(
    (event) => {
      const { name, type, checked, value } = event.target;
      const nextValue = type === 'checkbox' ? checked : value;

      setValues((prev) => {
        const next = { ...prev, [name]: nextValue };
        if (touched[name] && schema) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: schema.validateField(name, nextValue, next),
          }));
        }
        return next;
      });
    },
    [schema, touched],
  );

  /** Программная установка значения (для нестандартных контролов). */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /** Потеря фокуса — момент, когда впервые показываем ошибку. */
  const handleBlur = useCallback(
    (event) => {
      const { name } = event.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (schema) {
        setErrors((prev) => ({ ...prev, [name]: schema.validateField(name, values[name], values) }));
      }
    },
    [schema, values],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      setSubmitError(null);

      const nextErrors = schema ? schema.validate(values) : {};
      setErrors(nextErrors);
      // Помечаем все поля как «тронутые», чтобы показать все ошибки сразу.
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));

      if (Object.keys(nextErrors).length > 0) {
        // Прокручиваем к первому невалидному полю — забота об эргономике.
        const firstField = Object.keys(nextErrors)[0];
        document.querySelector(`[name="${firstField}"]`)?.focus();
        return false;
      }

      try {
        setSubmitting(true);
        await onSubmit?.(values);
        return true;
      } catch (error) {
        setSubmitError(error.message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, schema, values],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [initialValues]);

  /** Готовые пропсы для поля — меньше повторов в JSX. */
  const fieldProps = useCallback(
    (name) => ({
      name,
      value: values[name] ?? '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: touched[name] ? errors[name] : null,
    }),
    [values, errors, touched, handleChange, handleBlur],
  );

  const isValid = Object.values(errors).every((e) => !e);

  return {
    values,
    errors,
    touched,
    submitting,
    submitError,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues,
    reset,
    fieldProps,
  };
}
