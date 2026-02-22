import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ScrollProgressBar from './components/shared/ScrollProgressBar';
import Home from './pages/landing-page/home/Home';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import CookiePolicy from './pages/policies/CookiePolicy';
import TermsConditions from './pages/policies/TermsConditions';
import ContactUs from './pages/landing-page/contact-us/ContactUs';
import ApplyNow from './pages/landing-page/apply/ApplyNow';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/apply" element={<ApplyNow />} />
          {/* Catch-all — must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
