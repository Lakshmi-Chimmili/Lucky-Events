import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Calendar,
  Layers,
  Star,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { categoryAPI, serviceAPI } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

const DEFAULT_CATEGORIES = [
  {
    _id: '6ab51674725d99e2dadd0e26',
    name: 'Birthday Party',
    description: 'Vibrant birthdays with energetic party hosts, interactive games, balloon setups, and music.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 400,
  },
  {
    _id: '6ab51674725d99e2dadd0e27',
    name: 'Wedding/Marriage',
    description: 'Grand royal wedding coordination, full hospitality managers, guest welcoming, and flawless execution.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 1200,
  },
  {
    _id: '6ab51674725d99e2dadd0e28',
    name: 'Corporate/Professional',
    description: 'Elite corporate summits, executive conferences, seminars, team retreats, and annual galas.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 800,
  },
  {
    _id: '6ab51674725d99e2dadd0e29',
    name: 'Family Function',
    description: 'Intimate anniversaries, housewarming rituals, baby showers, and reunions handled with warmth.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 500,
  },
  {
    _id: '6ab51674725d99e2dadd0e2a',
    name: 'Festival & Cultural Celebration',
    description: 'Traditional festivals, cultural nights, community gatherings, and festive stage management.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 450,
  },
  {
    _id: '6ab51674725d99e2dadd0e2b',
    name: 'Anniversary & Engagement',
    description: 'Romantic engagement ceremonies, ring exchange functions, and milestone wedding anniversary celebrations.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 600,
  },
  {
    _id: '6ab51674725d99e2dadd0e2c',
    name: 'Concert & Stage Show',
    description: 'Large scale music concerts, live performances, award shows, and stage management with sound & lighting.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 750,
  },
  {
    _id: '6ab51674725d99e2dadd0e2d',
    name: 'Baby Shower & Naming Ceremony',
    description: 'Charming traditional & modern baby shower ceremonies, cradling events, and family welcoming rituals.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 350,
  },
];

export const HomePage = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          categoryAPI.getAll().catch(() => null),
          serviceAPI.getAll().catch(() => null),
        ]);
        if (catRes && catRes.success && Array.isArray(catRes.data) && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
        if (servRes && servRes.success && Array.isArray(servRes.data)) {
          setServices(servRes.data);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md">
          <Sparkles size={16} className="text-indigo-400" />
          Full-Service Event Staffing &amp; Manager Booking Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          We Supply The Managers.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300">
            You Enjoy The Celebration.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          From birthday parties and weddings to corporate summits and family functions.
          Book verified event managers, customized add-ons, and get transparent live pricing computed on the fly.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/book"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
          >
            Launch Booking Wizard <ArrowRight size={18} />
          </Link>
          <Link
            to="/categories"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-base px-8 py-4 rounded-full transition-all"
          >
            Explore Event Categories
          </Link>
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto p-6 bg-[#0f172a]/70 border border-white/10 rounded-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black text-white">100%</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Verified On-Site Staff</span>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0">
            <span className="text-3xl sm:text-4xl font-black text-indigo-400">₹0 Hidden Fees</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Real-Time Price Guarantee</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black text-pink-400">4.9 / 5.0</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Customer Trust Rating</span>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Event Categories</h2>
          <p className="mt-3 text-slate-400 text-base">
            Select the occasion to supply managers and on-site staff. Dynamic base rate per attendee.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading categories..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="group relative bg-[#0f172a]/80 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#090d16]/90 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ₹{cat.basePricePerAttendee} / attendee
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <Link
                      to={`/categories/${cat._id}`}
                      className="text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      View Details &rarr;
                    </Link>
                    <Link
                      to={`/book?category=${cat._id}`}
                      className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all"
                    >
                      Book This
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How it Works / Pricing Formula Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900/30 via-[#0f172a] to-pink-900/20 border border-indigo-500/30 rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Engineered Transparency</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              How Your Event Price Is Computed
            </h2>
            <p className="mt-4 text-slate-300 text-base leading-relaxed">
              No guesswork or inflated quotes. The system automatically computes exact pricing based on your attendee headcount and chosen entertainment add-ons:
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-indigo-400 font-bold text-sm mb-1">Step 1: Category Total</div>
              <div className="font-mono text-sm text-slate-200">
                Rate × Attendee Count
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Example: Wedding (₹1,500) × 100 guests = <strong className="text-white">₹150,000</strong>
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-pink-400 font-bold text-sm mb-1">Step 2: Add-on Services</div>
              <div className="font-mono text-sm text-slate-200">
                Flat Rates + (Per-Guest × Count)
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Example: DJ (₹8,000 flat) + Catering (₹300 × 100 = ₹30,000) = <strong className="text-white">₹38,000</strong>
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-indigo-500/40 bg-indigo-500/10">
              <div className="text-emerald-400 font-bold text-sm mb-1">Step 3: Grand Total</div>
              <div className="font-mono text-sm text-slate-200">
                Category Total + Add-ons Total
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Frozen on your booking ticket: <strong className="text-white text-sm">₹188,000</strong>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center sm:text-left">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all"
            >
              Try The Live Calculator In Wizard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Add-on Services Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Curated Add-On Services</h2>
          <p className="mt-3 text-slate-400 text-base">
            Customize your event with certified DJs, dance troupes, floral decorators, and gourmet catering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serv) => (
            <div
              key={serv._id}
              className="p-6 rounded-2xl bg-[#0f172a]/60 border border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-white">{serv.name}</h3>
                  <span
                    className={`text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                      serv.pricingType === 'flat'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {serv.pricingType === 'flat' ? 'Flat Rate' : 'Per Attendee'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {serv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="font-extrabold text-xl text-white">
                  ₹{serv.price.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    {serv.pricingType === 'flat' ? 'total' : '/ guest'}
                  </span>
                </span>
                <Link
                  to="/book"
                  className="text-xs font-bold text-pink-400 hover:text-pink-300"
                >
                  Add in Wizard &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
