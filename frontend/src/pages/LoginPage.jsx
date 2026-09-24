import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result?.success) {
      const loggedUser = result.user;
      const customFrom = location.state?.from?.pathname;
      if (customFrom && customFrom !== '/login' && customFrom !== '/register') {
        navigate(customFrom, { replace: true });
      } else if (loggedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (loggedUser.role === 'staff') {
        navigate('/staff-dashboard', { replace: true });
      } else {
        navigate('/my-bookings', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to LuckyEvents
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Sign in to book events, track schedules, or coordinate staff
          </p>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Role Accounts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@luckyevents.com', 'admin123')}
              className="px-2 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-700/60 text-xs font-semibold text-slate-200 transition flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('staff@luckyevents.com', 'staff123')}
              className="px-2 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-700/60 text-xs font-semibold text-slate-200 transition flex flex-col items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Staff</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('customer@luckyevents.com', 'customer123')}
              className="px-2 py-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-700/60 text-xs font-semibold text-slate-200 transition flex flex-col items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Register as Customer
          </Link>
        </p>
      </div>
    </div>
  );
};
