import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MainPage from './pages/MainPage';
import RecommendationPage from './pages/RecommendationPage';
import PaymentPage from './pages/PaymentPage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}