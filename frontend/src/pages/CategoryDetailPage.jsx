import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryAPI } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Users } from 'lucide-react';

export const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestEstimate, setGuestEstimate] = useState(50);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await categoryAPI.getById(id);
        if (res.success) setCategory(res.data);
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
