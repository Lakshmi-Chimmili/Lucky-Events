import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, Check, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-white">
              <span className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </span>
              <span>
                Lucky<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Events</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Premium event management and staffing solutions. Supplying trained coordinators,
              supervisors, and on-site staff for birthdays, weddings, corporate summits, and family functions.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Hyderabad & Bangalore Metro Centers, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+91 98765 43210 (24x7 Event Desk)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@luckyevents.com</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Event Types</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Birthday Parties
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Weddings & Receptions
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Corporate & Summits
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition">
                  Family Functions
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Instant Price Estimator →
                </Link>
              </li>
            </ul>
          </div>

          {/* Add-on Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Add-on Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Dance Performances
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Games & Entertainment
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Floral Decoration
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  DJ & Sound Systems
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Photography & Video
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition">
                  Full Catering Setup
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Staff & Portals</h4>
            <ul className="space-y-2.5 text-sm mb-6">
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Staff Assignment Desk
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Admin Command Center
                </Link>
              </li>
            </ul>
            <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Stay in Touch
            </h5>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for updates"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
              >
                {subscribed ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-400 mt-1.5">✓ Subscribed successfully!</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LuckyEvents Platform. Guaranteed Server-Side Transparent Pricing.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for seamless event coordination</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
