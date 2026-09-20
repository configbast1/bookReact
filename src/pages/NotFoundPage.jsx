import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, EmptyState } from '@/components/ui';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="container page">
      <EmptyState
        icon="🧭"
        title={t('notFound.title')}
        description={t('notFound.text')}
        action={
          <Link to="/">
            <Button>{t('notFound.action')}</Button>
          </Link>
        }
      />
    </div>
  );
}
