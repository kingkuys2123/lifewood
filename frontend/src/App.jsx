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
import Careers from './pages/landing-page/careers/Careers';
import InternalNews from './pages/landing-page/internal-news/InternalNews';
import PhilanthropyImpact from './pages/landing-page/philanthropy-&-impact/PhilanthropyImpact';
import AIServices from './pages/landing-page/ai-initiatives/ai-services/AIServices';
import AIProject from './pages/landing-page/ai-initiatives/ai-projects/AIProject';
import AboutUs from './pages/landing-page/our-company/about-us/AboutUs';
import Offices from './pages/landing-page/our-company/offices/Offices';
import TypeADataServicing from './pages/landing-page/what-we-offer/type-a-data-servicing/TypeADataServicing';
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
          <Route path="/apply"   element={<ApplyNow />} />
          <Route path="/careers"       element={<Careers />} />
          <Route path="/internal-news"  element={<InternalNews />} />
          <Route path="/philanthropy"   element={<PhilanthropyImpact />} />
          <Route path="/ai-initiatives/services" element={<AIServices />} />
          <Route path="/ai-initiatives/projects" element={<AIProject />} />
          <Route path="/our-company/about" element={<AboutUs />} />
          <Route path="/our-company/offices" element={<Offices />} />
          <Route path="/offer/type-a" element={<TypeADataServicing />} />
          {/* Catch-all — must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
