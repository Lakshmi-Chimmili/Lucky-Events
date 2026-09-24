import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryAPI } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

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

export const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(() => {
    return DEFAULT_CATEGORIES.find(
      (c) => c._id === id || c.name.toLowerCase() === (id || '').toLowerCase()
    ) || DEFAULT_CATEGORIES[0];
  });
  const [loading, setLoading] = useState(true);
  const [guestEstimate, setGuestEstimate] = useState(50);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await categoryAPI.getById(id);
        if (res && res.success && res.data) {
          setCategory(res.data);
        } else if (res && res.data) {
          setCategory(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch category:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading category overview..." padding="120px 20px" />;
  if (!category) return <div className="text-center py-20 text-slate-400">Category not found.</div>;

  const estimatedCategoryTotal = category.basePricePerAttendee * guestEstimate;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8">
        <ArrowLeft size={16} /> Back to all categories
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl h-80 md:h-[420px]">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-[#090d16]/90 border border-white/20 text-indigo-300 font-extrabold text-sm px-4 py-1.5 rounded-full">
            ₹{category.basePricePerAttendee} per attendee
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl sm:text-5xl font-black text-white">{category.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{category.description}</p>

          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Quick Headcount Estimator</h3>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300 font-semibold">Number of Attendees:</label>
              <input
                type="number"
                min="10"
                max="5000"
                value={guestEstimate}
                onChange={(e) => setGuestEstimate(Math.max(1, Number(e.target.value)))}
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-right text-white font-mono text-sm"
              />
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Base Staffing Cost:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                ₹{estimatedCategoryTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to={`/book?category=${category._id}&attendees=${guestEstimate}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
            >
              Continue to Booking Wizard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
