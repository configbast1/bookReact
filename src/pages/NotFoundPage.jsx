import { Link } from 'react-router-dom';
import { Button, EmptyState } from '@/components/ui';

/** NotFoundPage — страница 404. */
export default function NotFoundPage() {
  return (
    <div className="container page">
      <EmptyState
        icon="🧭"
        title="404 — сторінку не знайдено"
        description="Схоже, така сторінка не існує або була переміщена."
        action={<Link to="/"><Button>На головну</Button></Link>}
      />
    </div>
  );
}
