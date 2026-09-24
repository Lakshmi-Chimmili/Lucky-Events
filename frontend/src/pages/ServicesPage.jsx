import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Check, ArrowRight } from 'lucide-react';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceAPI.getAll();
        if (res.success) setServices(res.data);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-white">Add-On Services</h1>
        <p className="mt-3 text-slate-300 text-base">
          Enhance your event experience with certified entertainers, sound &amp; light engineers, caterers, and floral decorators.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading add-on services..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((serv) => (
            <div
              key={serv._id}
              className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all flex flex-col justify-between"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={serv.image} alt={serv.name} className="w-full h-full object-cover" />
                <span
                  className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    serv.pricingType === 'flat'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {serv.pricingType === 'flat' ? 'Flat Rate' : 'Per Attendee'}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{serv.name}</h2>
                  <p className="text-slate-400 text-xs leading-relaxed">{serv.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">
                      ₹{serv.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      {serv.pricingType === 'flat' ? 'total package' : '/ guest'}
                    </span>
                  </div>

                  <Link
                    to="/book"
                    className="bg-pink-600/20 hover:bg-pink-600 border border-pink-500/40 text-pink-300 hover:text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all"
                  >
                    Select in Wizard
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
