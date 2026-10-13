import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BuyTicket from './pages/BuyTicket';
import LogIn from './pages/LogIn';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Dynamic Browser Title Manager
function PageTitleManager() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/admin':
        document.title = 'Admin Portal | The Timeless M-Gala 2026';
        break;
      case '/admin/dashboard':
        document.title = 'Admin Dashboard | The Timeless M-Gala 2026';
        break;
      case '/dashboard':
        document.title = 'Student Dashboard | The Timeless M-Gala 2026';
        break;
      case '/buy-ticket':
        document.title = 'Reserve Pass | The Timeless M-Gala 2026';
        break;
      case '/login':
        document.title = 'Student Login | The Timeless M-Gala 2026';
        break;
      default:
        document.title = 'The Timeless M-Gala 2026';
    }
  }, [location]);

  return null;
}

// Route Guard for Admin Routes
function ProtectedAdminRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <PageTitleManager />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/buy-ticket" element={<BuyTicket />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin Login Route */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Admin Portal */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}