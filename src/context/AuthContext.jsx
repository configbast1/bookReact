import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { UserFactory } from '@/core/models';
import { userRepository } from '@/core/api';
import { cookieStore, STORAGE_KEYS } from '@/core/storage';

/**
 * AuthContext — авторизация.
 * Сессия хранится в COOKIE (живёт 7 дней и переживает перезагрузку вкладки),
 * а сам объект пользователя — это экземпляр класса Customer или AdminUser.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Восстановление сессии из cookie при старте приложения.
  useEffect(() => {
    const session = cookieStore.get(STORAGE_KEYS.SESSION, null);
    if (!session?.email) {
      setLoading(false);
      return;
    }
    userRepository
      .findByEmail(session.email)
      .then((raw) => {
        if (raw) setUser(UserFactory.create(raw));
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const raw = await userRepository.findByEmail(email);
    if (!raw) throw new Error('Користувача з таким email не знайдено');

    const model = UserFactory.create(raw);
    if (!model.checkPassword(password)) {
      throw new Error('Невірний пароль');
    }

    cookieStore.set(STORAGE_KEYS.SESSION, { email: model.email, at: Date.now() }, 7);
    setUser(model);
    return model;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('Такий email вже зареєстровано');

    const created = await userRepository.create({
      id: `u_${Date.now().toString(36)}`,
      role: 'customer',
      name,
      email,
      password,
      bonusPoints: 0,
    });
    const model = UserFactory.create(created);
    cookieStore.set(STORAGE_KEYS.SESSION, { email: model.email, at: Date.now() }, 7);
    setUser(model);
    return model;
  }, []);

  const logout = useCallback(() => {
    cookieStore.remove(STORAGE_KEYS.SESSION);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.isAdmin),
      can: (permission) => Boolean(user?.can(permission)),
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth має використовуватись всередині <AuthProvider>');
  return ctx;
}
