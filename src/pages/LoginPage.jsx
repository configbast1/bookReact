import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { loginSchema, registerSchema } from '@/validation/schemas.js';
import { translateError } from '@/validation/messages.js';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('login');
  const redirectTo = location.state?.from ?? '/';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  useEffect(() => {
    clearErrors();
  }, [mode, clearErrors]);

  const error = (field) => translateError(t, errors[field]?.message);

  const submit = handleSubmit(async (values) => {
    try {
      if (mode === 'login') {
        const user = await login(values.email, values.password);
        toast.success(t('login.welcome', { name: user.name }));
      } else {
        await registerUser(values);
        toast.success(t('login.registered'));
      }
      navigate(redirectTo, { replace: true });
    } catch (authError) {
      const text = authError.message.startsWith('login.') ? t(authError.message) : authError.message;
      setError('root', { message: text });
    }
  });

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const fillDemo = (email, password) => {
    reset({ name: '', email, password });
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="container page">
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.tabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? styles.tabActive : styles.tab}
              onClick={() => setMode('login')}
            >
              {t('login.login')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? styles.tabActive : styles.tab}
              onClick={() => setMode('register')}
            >
              {t('login.register')}
            </button>
          </div>

          <form onSubmit={submit} noValidate>
            {mode === 'register' && (
              <Input
                label={t('login.name')}
                required
                placeholder={t('login.namePlaceholder')}
                error={error('name')}
                {...register('name')}
              />
            )}

            <Input
              label={t('login.email')}
              type="email"
              required
              placeholder="you@mail.com"
              error={error('email')}
              {...register('email')}
            />

            <Input
              label={t('login.password')}
              type="password"
              required
              placeholder="••••••"
              hint={mode === 'register' ? t('login.passwordHint') : undefined}
              error={error('password')}
              {...register('password')}
            />

            {errors.root && <p className={styles.error}>{errors.root.message}</p>}

            <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
              {mode === 'login' ? t('login.submitLogin') : t('login.submitRegister')}
            </Button>
          </form>

          {mode === 'login' && (
            <div className={styles.demo}>
              <p className={styles.demoTitle}>{t('login.demoTitle')}</p>
              <button
                type="button"
                className={styles.demoButton}
                onClick={() => fillDemo('admin@book.ua', 'admin123')}
              >
                👑 {t('login.demoAdmin')}
              </button>
              <button
                type="button"
                className={styles.demoButton}
                onClick={() => fillDemo('user@book.ua', 'user123')}
              >
                🙋 {t('login.demoUser')}
              </button>
            </div>
          )}
        </div>

        <p className={styles.back}>
          <Link to="/">{t('login.backHome')}</Link>
        </p>
      </div>
    </div>
  );
}
