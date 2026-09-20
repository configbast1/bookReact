import { useTranslation } from 'react-i18next';
import { FactList } from '@/components/about';
import { Button, EmptyState, Spinner } from '@/components/ui';
import { useAboutMe } from '@/hooks';
import env from '@/config/env.js';
import styles from './AboutMePage.module.css';

export default function AboutMePage() {
  const { t } = useTranslation();
  const { data, isPending, isError, error, refetch, isFetching } = useAboutMe();

  return (
    <div className="container page">
      <div className="pageHeader">
        <div>
          <h1>{t('about.title')}</h1>
          <p className={styles.subtitle}>{t('about.subtitle', { url: env.aboutMeUrl })}</p>
        </div>
        <a className={styles.link} href={env.aboutMeUrl} target="_blank" rel="noreferrer">
          {t('about.openEndpoint')}
        </a>
      </div>

      {isPending && <Spinner label={t('about.loading')} />}

      {isError && (
        <EmptyState
          icon="🛰"
          title={t('about.error')}
          description={error.message}
          action={
            <Button onClick={() => refetch()} loading={isFetching}>
              {t('about.retry')}
            </Button>
          }
        />
      )}

      {data && (
        <>
          <h2 className={styles.sectionTitle}>{t('about.facts')}</h2>
          <FactList facts={data} />

          <h2 className={styles.sectionTitle}>{t('about.raw')}</h2>
          <pre className={styles.raw}>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
