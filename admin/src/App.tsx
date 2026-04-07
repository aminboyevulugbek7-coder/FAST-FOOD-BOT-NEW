import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
