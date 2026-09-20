import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { profileSchema } from '@/validation/schemas.js';
import { translateError } from '@/validation/messages.js';
import styles from './AccountPage.module.css';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    },
  });

  const error = (field) => translateError(t, errors[field]?.message);

  const submit = handleSubmit(async (values) => {
    try {
      await updateProfile(values);
      toast.success(t('account.saved'));
    } catch (submitError) {
      setError('root', { message: submitError.message });
    }
  });

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>{t('account.profileTitle')}</h2>
      <p className={styles.panelText}>{t('account.profileText')}</p>

      <form onSubmit={submit} noValidate>
        <div className={styles.grid2}>
          <Input label={t('account.name')} required error={error('name')} {...register('name')} />
          <Input
            label={t('account.email')}
            type="email"
            required
            error={error('email')}
            {...register('email')}
          />
        </div>

        <div className={styles.grid2}>
          <Input
            label={t('account.phone')}
            required
            placeholder="+380671234567"
            error={error('phone')}
            {...register('phone')}
          />
          <Input label={t('account.address')} error={error('address')} {...register('address')} />
        </div>

        {errors.root && <p className={styles.panelText}>{errors.root.message}</p>}

        <div className={styles.actions}>
          <Button type="submit" loading={isSubmitting}>
            {t('account.save')}
          </Button>
        </div>
      </form>

      <dl className={styles.meta}>
        <div>
          <dt>{t('account.role')}</dt>
          <dd>{user?.isAdmin ? t('account.roleAdmin') : t('account.roleCustomer')}</dd>
        </div>
        <div>
          <dt>{t('account.bonus')}</dt>
          <dd>{user?.bonusPoints ?? 0}</dd>
        </div>
      </dl>
    </section>
  );
}
