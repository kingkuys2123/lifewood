import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './app/guards/ProtectedRoute';
import PortalLayout from './app/layouts/PortalLayout';
import PublicSiteLayout from './app/layouts/PublicSiteLayout';
import AuthProvider from './app/providers/AuthProvider';
import ApplicantsPage from './pages/applicants/ApplicantsPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LandingPage from './pages/landing/LandingPage';
import Home from './pages/landing-page/home/Home';
import ProfileEditPage from './pages/profile/ProfileEditPage';
import CookiePolicy from './pages/policies/CookiePolicy';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsConditions from './pages/policies/TermsConditions';
import UsersPage from './pages/users/UsersPage';
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
import TypeBHorizontalLLMData from './pages/landing-page/what-we-offer/type-b-horizontal-llm-data/TypeBHorizontalLLMData';
import TypeCVerticalLLMData from './pages/landing-page/what-we-offer/type-c-vertical-llm-data/TypeCVerticalLLMData';
import TypeDAIGC from './pages/landing-page/what-we-offer/type-d-aigc/TypeDAIGC';
import NotFound from './pages/NotFound';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="/portal"
            element={(
              <ProtectedRoute allowedRoles={['ADMIN', 'USER']}>
                <PortalLayout />
              </ProtectedRoute>
            )}
          >
            <Route index element={<DashboardPage />} />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route
              path="users"
              element={(
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UsersPage />
                </ProtectedRoute>
              )}
            />
            <Route path="profile/edit" element={<ProfileEditPage />} />
          </Route>

          <Route element={<PublicSiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/apply" element={<ApplyNow />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/internal-news" element={<InternalNews />} />
            <Route path="/philanthropy" element={<PhilanthropyImpact />} />
            <Route path="/ai-initiatives/services" element={<AIServices />} />
            <Route path="/ai-initiatives/projects" element={<AIProject />} />
            <Route path="/our-company/about" element={<AboutUs />} />
            <Route path="/our-company/offices" element={<Offices />} />
            <Route path="/offer/type-a" element={<TypeADataServicing />} />
            <Route path="/offer/type-b" element={<TypeBHorizontalLLMData />} />
            <Route path="/offer/type-c" element={<TypeCVerticalLLMData />} />
            <Route path="/offer/type-d" element={<TypeDAIGC />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
