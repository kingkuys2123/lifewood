import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ScrollProgressBar from './components/shared/ScrollProgressBar';
import Home from './pages/landing-page/home/Home';

export default function App() {
  return (
    <BrowserRouter>
      {/* Thin scroll-progress bar — sits above the navbar */}
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
