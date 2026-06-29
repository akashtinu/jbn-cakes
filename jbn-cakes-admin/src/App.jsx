import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
