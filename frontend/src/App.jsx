import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Lojas from './pages/Lojas';
import Carrinho from './pages/Carrinho';

import Encomenda from './pages/Encomenda';
import './App.css';

function AppContent() {
  const { cartCount } = useCart();

  return (
    <div className="app">
      <Header cartCount={cartCount} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lojas" element={<Lojas />} />
          <Route path="/carrinho" element={<Carrinho />} />

          <Route path="/encomenda/:id" element={<Encomenda />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;

