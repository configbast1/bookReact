import { useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { CartSummary } from '@/components/cart';
import { useCart, useForm } from '@/hooks';
import { useAuth } from '@/context/AuthContext.jsx';
import { useToast } from '@/context/ToastContext.jsx';
import { checkoutSchema } from '@/core/validation';
import { placeOrder, decreaseStock } from '@/store';
import styles from './CheckoutPage.module.css';

const DELIVERY_OPTIONS = [
  { value: 'nova', label: 'Нова Пошта (відділення)' },
  { value: 'courier', label: "Курʼєр за адресою" },
  { value: 'pickup', label: 'Самовивіз з магазину' },
];

const PAYMENT_OPTIONS = [
  { value: '', label: '— Оберіть спосіб —' },
  { value: 'card', label: 'Картка онлайн' },
  { value: 'cod', label: 'Накладений платіж' },
  { value: 'cash', label: 'Готівкою при отриманні' },
];

/**
 * CheckoutPage — оформление заказа.
 * Вся валидация приходит из ООП-схемы checkoutSchema,
 * а состояние формы ведёт хук useForm.
 */
export default function CheckoutPage() {
  const { items, totals, clear, promo } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Флаг «заказ уже оформлен»: после очистки корзины компонент
  // не должен успеть отправить пользователя обратно на /cart.
  const placedRef = useRef(false);

  const form = useForm(
    {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      city: '',
      address: user?.address ?? '',
      delivery: 'nova',
      payment: '',
      comment: '',
    },
    checkoutSchema,
    async (values) => {
      const payload = {
        userId: user?.id ?? null,
        items: items.map((i) => ({
          bookId: i.book.id,
          title: i.book.title,
          author: i.book.author,
          price: i.book.getFinalPrice(),
          quantity: i.quantity,
        })),
        customer: { ...values },
        shipping: totals.shipping,
        discount: totals.promoDiscount,
        comment: values.comment,
        status: 'new',
      };

      const result = await dispatch(placeOrder(payload)).unwrap();
      dispatch(decreaseStock(payload.items));
      placedRef.current = true;
      clear();
      toast.success('Замовлення оформлено!');
      navigate(`/orders?highlight=${result.id}`);
    },
  );

  // Пустая корзина — оформлять нечего, отправляем обратно.
  // Исключение: корзину только что очистили после успешного заказа.
  if (items.length === 0 && !placedRef.current) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="container page">
      <h1>Оформлення замовлення</h1>

      <form className={styles.layout} onSubmit={form.handleSubmit} noValidate>
        <div className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Контактні дані</h2>
            <div className={styles.grid2}>
              <Input label="Імʼя та прізвище" required placeholder="Іван Петренко" {...form.fieldProps('name')} />
              <Input label="Email" type="email" required placeholder="you@mail.com" {...form.fieldProps('email')} />
            </div>
            <Input
              label="Телефон"
              required
              placeholder="+380671234567"
              hint="Формат: +380XXXXXXXXX"
              {...form.fieldProps('phone')}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Доставка</h2>
            <Select
              label="Спосіб доставки"
              options={DELIVERY_OPTIONS}
              value={form.values.delivery}
              onChange={form.handleChange}
              name="delivery"
            />
            <div className={styles.grid2}>
              <Input label="Місто" required placeholder="Київ" {...form.fieldProps('city')} />
              <Input
                label={form.values.delivery === 'nova' ? 'Відділення' : 'Адреса'}
                required
                placeholder={form.values.delivery === 'nova' ? 'Відділення №12' : 'вул. Шевченка, 10, кв. 5'}
                {...form.fieldProps('address')}
              />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Оплата</h2>
            <Select label="Спосіб оплати" required options={PAYMENT_OPTIONS} {...form.fieldProps('payment')} />
            <Textarea
              label="Коментар до замовлення"
              placeholder="Побажання щодо доставки, подарункове пакування…"
              {...form.fieldProps('comment')}
            />
          </section>

          {form.submitError && <p className={styles.submitError}>{form.submitError}</p>}
        </div>

        <CartSummary showPromo={!promo}>
          <Button type="submit" fullWidth size="lg" loading={form.submitting}>
            Підтвердити замовлення
          </Button>
          <p className={styles.agreement}>
            Натискаючи кнопку, ви погоджуєтесь з умовами обробки персональних даних.
          </p>
        </CartSummary>
      </form>
    </div>
  );
}
