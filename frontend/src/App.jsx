import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingWizardPage } from './pages/BookingWizardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Smart Dashboard Redirection based on role
const DashboardDispatcher = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'staff') return <Navigate to="/staff-dashboard" replace />;
  return <Navigate to="/my-bookings" replace />;
};

// 404 Fallback
const NotFoundPage = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-slate-950">
    <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold text-5xl mb-4">
      404
    </div>
    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Page Not Found</h1>
    <p className="text-slate-400 max-w-md mb-8 text-sm">
      The page or event booking resource you are looking for doesn't exist or has moved.
    </p>
    <Link
      to="/"
      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition"
    >
      Return to Home
    </Link>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <Toast />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:id" element={<CategoryDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />

              {/* Booking Wizard */}
              <Route path="/book" element={<BookingWizardPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signup" element={<Navigate to="/register" replace />} />

              {/* Universal Dashboard dispatcher */}
              <Route path="/dashboard" element={<DashboardDispatcher />} />

              {/* Customer Dashboard */}
              <Route
                path="/my-bookings"
                element={
                  <RoleProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboardPage />
                  </RoleProtectedRoute>
                }
              />

              {/* Staff Dashboard */}
              <Route
                path="/staff-dashboard"
                element={
                  <RoleProtectedRoute allowedRoles={['staff']}>
                    <StaffDashboardPage />
                  </RoleProtectedRoute>
                }
              />

              {/* Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </RoleProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
