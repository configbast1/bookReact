import { useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { CartSummary } from '@/components/cart';
import { useCart } from '@/hooks';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { checkoutSchema } from '@/validation/schemas.js';
import { translateError } from '@/validation/messages.js';
import { placeOrder, decreaseStock } from '@/store';
import styles from './CheckoutPage.module.css';

const DELIVERY_KEYS = ['nova', 'courier', 'pickup'];
const PAYMENT_KEYS = ['card', 'cod', 'cash'];

export default function CheckoutPage() {
  const { t } = useTranslation();
  const { items, totals, clear, promo } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const placedRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      city: '',
      address: user?.address ?? '',
      delivery: 'nova',
      payment: '',
      comment: '',
    },
  });

  const delivery = watch('delivery');
  const error = (field) => translateError(t, errors[field]?.message);

  const submit = handleSubmit(async (values) => {
    const payload = {
      userId: user?.id ?? null,
      items: items.map((item) => ({
        bookId: item.book.id,
        title: item.book.title,
        author: item.book.author,
        price: item.book.getFinalPrice(),
        quantity: item.quantity,
      })),
      customer: { ...values },
      shipping: totals.shipping,
      discount: totals.promoDiscount,
      comment: values.comment,
      status: 'new',
    };

    try {
      const result = await dispatch(placeOrder(payload)).unwrap();
      dispatch(decreaseStock(payload.items));
      placedRef.current = true;
      clear();
      toast.success(t('checkout.success'));
      navigate(`/account/orders?highlight=${result.id}`);
    } catch (submitError) {
      setError('root', { message: submitError.message });
    }
  });

  if (items.length === 0 && !placedRef.current) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="container page">
      <h1>{t('checkout.title')}</h1>

      <form className={styles.layout} onSubmit={submit} noValidate>
        <div className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('checkout.step1')}</h2>

            <div className={styles.grid2}>
              <Input
                label={t('checkout.name')}
                required
                placeholder={t('checkout.namePlaceholder')}
                error={error('name')}
                {...register('name')}
              />
              <Input
                label={t('checkout.email')}
                type="email"
                required
                placeholder="you@mail.com"
                error={error('email')}
                {...register('email')}
              />
            </div>

            <Input
              label={t('checkout.phone')}
              required
              placeholder="+380671234567"
              hint={t('checkout.phoneHint')}
              error={error('phone')}
              {...register('phone')}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('checkout.step2')}</h2>

            <Select
              label={t('checkout.delivery')}
              options={DELIVERY_KEYS.map((key) => ({
                value: key,
                label: t(`checkout.deliveryOptions.${key}`),
              }))}
              error={error('delivery')}
              {...register('delivery')}
            />

            <div className={styles.grid2}>
              <Input
                label={t('checkout.city')}
                required
                placeholder={t('checkout.cityPlaceholder')}
                error={error('city')}
                {...register('city')}
              />
              <Input
                label={delivery === 'nova' ? t('checkout.branch') : t('checkout.address')}
                required
                placeholder={
                  delivery === 'nova'
                    ? t('checkout.branchPlaceholder')
                    : t('checkout.addressPlaceholder')
                }
                error={error('address')}
                {...register('address')}
              />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('checkout.step3')}</h2>

            <Select
              label={t('checkout.payment')}
              required
              options={[
                { value: '', label: t('checkout.paymentOptions.choose') },
                ...PAYMENT_KEYS.map((key) => ({
                  value: key,
                  label: t(`checkout.paymentOptions.${key}`),
                })),
              ]}
              error={error('payment')}
              {...register('payment')}
            />

            <Textarea
              label={t('checkout.comment')}
              placeholder={t('checkout.commentPlaceholder')}
              error={error('comment')}
              {...register('comment')}
            />
          </section>

          {errors.root && <p className={styles.submitError}>{errors.root.message}</p>}
        </div>

        <CartSummary showPromo={!promo}>
          <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
            {t('checkout.submit')}
          </Button>
          <p className={styles.agreement}>{t('checkout.agreement')}</p>
        </CartSummary>
      </form>
    </div>
  );
}
