import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { UserFactory } from '@/core/models';
import { userRepository } from '@/core/api';
import { cookieStore, STORAGE_KEYS } from '@/core/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (!raw) throw new Error('login.userNotFound');

    const model = UserFactory.create(raw);
    if (!model.checkPassword(password)) throw new Error('login.wrongPassword');

    cookieStore.set(STORAGE_KEYS.SESSION, { email: model.email, at: Date.now() }, 7);
    setUser(model);
    return model;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error('login.emailTaken');

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

  const updateProfile = useCallback(
    async (changes) => {
      if (!user) throw new Error('login.userNotFound');

      const raw = (await userRepository.findByEmail(user.email)) ?? {};
      const merged = { ...raw, ...changes };

      await userRepository.update(user.id, merged);

      const model = UserFactory.create(merged);
      cookieStore.set(STORAGE_KEYS.SESSION, { email: model.email, at: Date.now() }, 7);
      setUser(model);
      return model;
    },
    [user],
  );

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
      updateProfile,
      logout,
    }),
    [user, loading, login, register, updateProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
