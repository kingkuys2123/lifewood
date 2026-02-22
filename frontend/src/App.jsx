import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Home from './pages/landing-page/home/Home';

export default function App() {
  return (
    <BrowserRouter>
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
