import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { useForm } from '@/hooks';
import { loginSchema, registerSchema } from '@/core/validation';
import styles from './LoginPage.module.css';

/** LoginPage — вход и регистрация в одной форме с переключателем. */
export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // login | register

  const redirectTo = location.state?.from ?? '/';

  const loginForm = useForm({ email: '', password: '' }, loginSchema, async (values) => {
    const user = await login(values.email, values.password);
    toast.success(`Вітаємо, ${user.name}!`);
    navigate(redirectTo, { replace: true });
  });

  const registerForm = useForm(
    { name: '', email: '', password: '' },
    registerSchema,
    async (values) => {
      await register(values);
      toast.success('Реєстрація успішна!');
      navigate(redirectTo, { replace: true });
    },
  );

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const form = mode === 'login' ? loginForm : registerForm;

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
              Вхід
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? styles.tabActive : styles.tab}
              onClick={() => setMode('register')}
            >
              Реєстрація
            </button>
          </div>

          <form onSubmit={form.handleSubmit} noValidate>
            {mode === 'register' && (
              <Input label="Імʼя" required placeholder="Іван Петренко" {...registerForm.fieldProps('name')} />
            )}

            <Input label="Email" type="email" required placeholder="you@mail.com" {...form.fieldProps('email')} />

            <Input
              label="Пароль"
              type="password"
              required
              placeholder="••••••"
              hint={mode === 'register' ? 'Мінімум 6 символів, літера та цифра' : undefined}
              {...form.fieldProps('password')}
            />

            {form.submitError && <p className={styles.error}>{form.submitError}</p>}

            <Button type="submit" fullWidth size="lg" loading={form.submitting}>
              {mode === 'login' ? 'Увійти' : 'Зареєструватися'}
            </Button>
          </form>

          {mode === 'login' && (
            <div className={styles.demo}>
              <p className={styles.demoTitle}>Демо-доступи:</p>
              <button
                type="button"
                className={styles.demoButton}
                onClick={() => loginForm.setValues({ email: 'admin@book.ua', password: 'admin123' })}
              >
                👑 Адміністратор — admin@book.ua / admin123
              </button>
              <button
                type="button"
                className={styles.demoButton}
                onClick={() => loginForm.setValues({ email: 'user@book.ua', password: 'user123' })}
              >
                🙋 Покупець — user@book.ua / user123
              </button>
            </div>
          )}
        </div>

        <p className={styles.back}>
          <Link to="/">← На головну</Link>
        </p>
      </div>
    </div>
  );
}
