import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

/**
 * Layout — общий каркас страниц.
 * <Outlet /> — место, куда react-router подставляет текущую страницу.
 */
export default function Layout() {
  return (
    <>
      <a href="#main" className="visually-hidden">Перейти до вмісту</a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
