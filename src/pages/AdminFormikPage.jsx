import { useDispatch } from 'react-redux';
import { createBook } from '@/store';
import { FormikBookForm } from '@/components/admin';

export default function AdminFormikPage() {
  const dispatch = useDispatch();

  const handleCreate = (values) =>
    dispatch(
      createBook({
        ...values,
        price: Number(values.price),
        year: Number(values.year),
        stock: values.format === 'paper' ? 10 : 0,
        rating: 0,
        reviewsCount: 0,
        language: 'uk',
        description: '',
      }),
    ).unwrap();

  return <FormikBookForm onCreate={handleCreate} />;
}
