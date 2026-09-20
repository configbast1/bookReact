import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <>
      <a href="#main" className="visually-hidden">
        {t('common.skipToContent')}
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
