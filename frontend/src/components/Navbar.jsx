import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Layers,
  Sparkle,
  User,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Briefcase,
  Ticket,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isStaff) return '/staff-dashboard';
    return '/my-bookings';
  };

  const getDashboardLabel = () => {
    if (isAdmin) return 'Admin Cockpit';
    if (isStaff) return 'Staff Portal';
    return 'My Bookings';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/80 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={20} />
          </div>
          <span>Lucky<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Events</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/categories"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/categories' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            Event Categories
          </Link>
          <Link
            to="/services"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/services' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            Add-on Services
          </Link>
          <Link
            to="/book"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/book' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            Booking Wizard
          </Link>
        </nav>

        {/* Actions & User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
              >
                {isAdmin ? <ShieldAlert size={14} /> : isStaff ? <Briefcase size={14} /> : <Ticket size={14} />}
                {getDashboardLabel()}
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                title="View Profile Settings"
              >
                <User size={14} className="text-indigo-400" />
                <span className="font-semibold text-white">
                  {user?.name ? user.name.split(' ')[0] : 'Account'}
                </span>
                {user?.role && (
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-200 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/book"
                className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-sm px-4 py-2 rounded-full shadow-md shadow-indigo-500/30 transition-transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <PlusCircle size={16} /> Book Event
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-white/10 px-4 py-6 space-y-4">
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-1"
          >
            Event Categories
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-medium py-1"
          >
            Add-on Services
          </Link>
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-indigo-400 font-bold py-1"
          >
            Booking Wizard
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-indigo-300 font-bold"
              >
                {getDashboardLabel()} {user?.role ? `(${user.role})` : ''}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-200 font-medium py-1"
              >
                My Profile Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block text-rose-400 font-semibold text-sm"
              >
                Log Out {user?.name ? `(${user.name})` : ''}
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-white/5 font-semibold text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 rounded-lg bg-indigo-600 font-semibold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
