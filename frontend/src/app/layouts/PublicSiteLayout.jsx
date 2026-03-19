import { Outlet } from 'react-router-dom';
import Footer from '../../components/shared/Footer';
import Navbar from '../../components/shared/Navbar';
import ScrollProgressBar from '../../components/shared/ScrollProgressBar';

export default function PublicSiteLayout() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

