import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowRight, Users, CheckCircle } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  {
    _id: '6ab51674725d99e2dadd0e26',
    name: 'Birthday Party',
    description: 'Vibrant birthdays with energetic party hosts, interactive games, balloon setups, and music.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 500,
  },
  {
    _id: '6ab51674725d99e2dadd0e27',
    name: 'Wedding/Marriage',
    description: 'Grand royal wedding coordination, full hospitality managers, guest welcoming, and flawless execution.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 1500,
  },
  {
    _id: '6ab51674725d99e2dadd0e28',
    name: 'Corporate/Professional',
    description: 'Elite corporate summits, executive conferences, seminars, team retreats, and annual galas.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 1000,
  },
  {
    _id: '6ab51674725d99e2dadd0e29',
    name: 'Family Function',
    description: 'Intimate anniversaries, housewarming rituals, baby showers, and reunions handled with warmth.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
    basePricePerAttendee: 700,
  },
];

export const CategoriesPage = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        } else if (Array.isArray(res) && res.length > 0) {
          setCategories(res);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-white">Event Categories</h1>
        <p className="mt-3 text-slate-300 text-base">
          Browse our supported occasions. We supply verified managers and crew for celebrations of any scale.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading event categories..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-56 md:h-auto relative">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#090d16]/90 border border-white/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                  ₹{cat.basePricePerAttendee} / attendee
                </div>
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{cat.name}</h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle size={14} className="text-emerald-400" />
                    Dedicated Lead Manager Included
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle size={14} className="text-emerald-400" />
                    Pre-event Venue Coordination
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={`/categories/${cat._id}`}
                    className="text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Details &rarr;
                  </Link>
                  <Link
                    to={`/book?category=${cat._id}`}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all"
                  >
                    Book This Event
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
