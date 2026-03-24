import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './app/guards/ProtectedRoute';
import PortalLayout from './app/layouts/PortalLayout';
import PublicSiteLayout from './app/layouts/PublicSiteLayout';
import AuthProvider from './app/providers/AuthProvider';
import './styles/global.css';

const ApplicantsPage = lazy(() => import('./pages/applicants/ApplicantsPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const Home = lazy(() => import('./pages/landing-page/home/Home'));
const ProfileEditPage = lazy(() => import('./pages/profile/ProfileEditPage'));
const CookiePolicy = lazy(() => import('./pages/policies/CookiePolicy'));
const PrivacyPolicy = lazy(() => import('./pages/policies/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/policies/TermsConditions'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));
const ContactUs = lazy(() => import('./pages/landing-page/contact-us/ContactUs'));
const ApplyNow = lazy(() => import('./pages/landing-page/apply/ApplyNow'));
const Careers = lazy(() => import('./pages/landing-page/careers/Careers'));
const InternalNews = lazy(() => import('./pages/landing-page/internal-news/InternalNews'));
const PhilanthropyImpact = lazy(() => import('./pages/landing-page/philanthropy-&-impact/PhilanthropyImpact'));
const AIServices = lazy(() => import('./pages/landing-page/ai-initiatives/ai-services/AIServices'));
const AIProject = lazy(() => import('./pages/landing-page/ai-initiatives/ai-projects/AIProject'));
const AboutUs = lazy(() => import('./pages/landing-page/our-company/about-us/AboutUs'));
const Offices = lazy(() => import('./pages/landing-page/our-company/offices/Offices'));
const TypeADataServicing = lazy(() => import('./pages/landing-page/what-we-offer/type-a-data-servicing/TypeADataServicing'));
const TypeBHorizontalLLMData = lazy(() => import('./pages/landing-page/what-we-offer/type-b-horizontal-llm-data/TypeBHorizontalLLMData'));
const TypeCVerticalLLMData = lazy(() => import('./pages/landing-page/what-we-offer/type-c-vertical-llm-data/TypeCVerticalLLMData'));
const TypeDAIGC = lazy(() => import('./pages/landing-page/what-we-offer/type-d-aigc/TypeDAIGC'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return <div className="app-page-loading">Loading...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
