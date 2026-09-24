import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Check, ArrowRight } from 'lucide-react';

const DEFAULT_SERVICES = [
  {
    _id: '6ab51674725d99e2dadd0e2e',
    name: 'Games & Entertainment Host',
    description: 'Professional anchor, stage host, fun interactive party games, and gift distribution.',
    pricingType: 'flat',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e2f',
    name: 'Natural / Floral Decoration',
    description: 'Fresh flower mandap, entrance arches, aisle styling, and thematic table centerpiece decor.',
    pricingType: 'per_attendee',
    price: 100,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e30',
    name: 'Special Effects & Pyrotechnics',
    description: 'Cold fire sparklers, dry ice fog entry, confetti cannons, and stage atmospheric lighting.',
    pricingType: 'flat',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e31',
    name: 'Dance Performance Team',
    description: 'Professional choreographers, Bollywood & contemporary dance troupe for grand entries & stage shows.',
    pricingType: 'flat',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e32',
    name: 'DJ & Sound System',
    description: 'High-end line array speakers, bass subwoofers, intelligent moving head lights, and concert DJ.',
    pricingType: 'flat',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e33',
    name: 'Catering Service',
    description: 'Multi-cuisine buffet spread, live food counters, mocktail bar, and uniformed service staff.',
    pricingType: 'per_attendee',
    price: 220,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e34',
    name: 'Photography & Videography',
    description: '4K cinematic teaser video, drone aerial footage, candid photography, and digital photo album.',
    pricingType: 'flat',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e35',
    name: 'Live Music Band',
    description: 'Acoustic live band, vocalists, keyboardists, and traditional instruments for musical ambiance.',
    pricingType: 'flat',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
  },
  {
    _id: '6ab51674725d99e2dadd0e36',
    name: 'Valet & Security Crew',
    description: 'Uniformed valet drivers, parking management crew, and bouncer security for guest safety.',
    pricingType: 'flat',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=800&auto=format&fit=crop&q=80',
  },
];

export const ServicesPage = () => {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceAPI.getAll();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data);
        } else if (Array.isArray(res) && res.length > 0) {
          setServices(res);
        }
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
                <img
                  src={serv.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'}
                  alt={serv.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';
                  }}
                />
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
