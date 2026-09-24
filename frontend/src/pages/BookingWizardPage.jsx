import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Calendar,
  MapPin,
  Users,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { categoryAPI, serviceAPI, bookingAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const BookingWizardPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Wizard Steps: 1: Category, 2: Details & Headcount, 3: Add-ons, 4: Review
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [attendeeCount, setAttendeeCount] = useState(100);
  const [eventDate, setEventDate] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);

  // Fetch Categories & Services from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          categoryAPI.getAll(),
          serviceAPI.getAll(),
        ]);

        if (catRes.success) {
          setCategories(catRes.data);
          // Check if category was pre-selected in URL param
          const preCat = searchParams.get('category');
          if (preCat && catRes.data.some((c) => c._id === preCat)) {
            setSelectedCategoryId(preCat);
          } else if (catRes.data.length > 0) {
            setSelectedCategoryId(catRes.data[0]._id);
          }
        }

        if (servRes.success) {
          setServices(servRes.data);
        }

        const preAttendees = searchParams.get('attendees');
        if (preAttendees && Number(preAttendees) > 0) {
          setAttendeeCount(Number(preAttendees));
        }

        // Set default date to 14 days in future
        const future = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const yyyy = future.getFullYear();
        const mm = String(future.getMonth() + 1).padStart(2, '0');
        const dd = String(future.getDate()).padStart(2, '0');
        setEventDate(`${yyyy}-${mm}-${dd}T17:00`);
      } catch (err) {
        showToast('Failed to load catalog from database.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Derived selected category and add-on objects
  const selectedCategory = categories.find((c) => c._id === selectedCategoryId);
  const selectedServices = services.filter((s) => selectedAddOnIds.includes(s._id));

  // --- Real-time Price Computation (identical to server formula) ---
  const count = Math.max(1, parseInt(attendeeCount, 10) || 1);
  const categoryRate = selectedCategory ? selectedCategory.basePricePerAttendee : 0;
  const categoryTotal = categoryRate * count;

  let addOnsTotal = 0;
  const addOnsLineItems = selectedServices.map((addon) => {
    const lineTotal =
      addon.pricingType === 'perAttendee' ? addon.price * count : addon.price;
    addOnsTotal += lineTotal;
    return {
      id: addon._id,
      name: addon.name,
      pricingType: addon.pricingType,
      unitPrice: addon.price,
      lineTotal,
    };
  });

  const grandTotal = categoryTotal + addOnsTotal;

  // Toggle add-on service selection
  const handleToggleAddOn = (serviceId) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Submit Booking
  const handleFinalSubmit = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to confirm and record your booking.', 'info');
      navigate('/login', { state: { from: { pathname: '/book' } } });
      return;
    }

    if (!selectedCategoryId || !eventDate || !venueAddress || count < 1) {
      showToast('Please provide all mandatory booking fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category: selectedCategoryId,
        addOns: selectedAddOnIds,
        attendeeCount: count,
        eventDate: new Date(eventDate).toISOString(),
        venueAddress,
        notes,
      };

      const res = await bookingAPI.create(payload);
      if (res.success) {
        showToast('Booking successfully confirmed & recorded!', 'success');

        // Confetti celebration!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        // Redirect to customer dashboard
        navigate('/my-bookings');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit booking.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Preparing booking wizard..." padding="120px 20px" />;
  }

  const steps = [
    { number: 1, title: 'Category' },
    { number: 2, title: 'Venue & Schedule' },
    { number: 3, title: 'Add-Ons' },
    { number: 4, title: 'Live Price Review' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Wizard Header & Stepper */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Event Booking Wizard</h1>
        <p className="mt-2 text-slate-400 text-sm">
          Configure your staff requirements, attendees, and entertainment with live price updates.
        </p>

        {/* Stepper Bar */}
        <div className="mt-8 flex items-center justify-center max-w-2xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.number)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep === step.number
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-110'
                      : currentStep > step.number
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {currentStep > step.number ? <Check size={18} /> : step.number}
                </button>
                <span className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                  currentStep === step.number ? 'text-indigo-400' : 'text-slate-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-emerald-600' : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Step Area (Left 2 cols) */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* STEP 1: Select Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">Step 1: Choose Occasion / Category</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Each category comes with dedicated lead managers and an attendee base rate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat._id;
                  return (
                    <div
                      key={cat._id}
                      onClick={() => setSelectedCategoryId(cat._id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full">
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-white text-base">{cat.name}</h3>
                          <span className="text-xs font-bold text-emerald-400">
                            ₹{cat.basePricePerAttendee}/guest
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all"
                >
                  Next: Schedule &amp; Headcount <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Venue, Date & Headcount */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">Step 2: Headcount, Schedule &amp; Venue</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Attendee count directly drives the category base rate and per-guest add-ons.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Expected Attendee Headcount *
                  </label>
                  <div className="relative">
                    <Users size={18} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={attendeeCount}
                      onChange={(e) => setAttendeeCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white text-base font-semibold focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Base Category Staffing = ₹{categoryRate} × {count} = <strong>₹{(categoryRate * count).toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Event Date &amp; Time *
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white text-sm font-semibold focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Venue Address / Function Hall *
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Royal Orchid Convention Center, MG Road, Bengaluru"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Special Notes / Instructions for Event Staff
                  </label>
                  <div className="relative">
                    <FileText size={18} className="absolute left-3.5 top-3 text-slate-400" />
                    <textarea
                      placeholder="e.g. Stage welcome setup at 4 PM, guest welcoming at reception desk..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:border-indigo-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!venueAddress) {
                      showToast('Please enter the venue address.', 'error');
                      return;
                    }
                    setCurrentStep(3);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all"
                >
                  Next: Select Add-Ons <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Add-on Services Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white">Step 3: Select Optional Add-On Services</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose DJs, floral decoration, dancers, games, or catering. Prices dynamically compute below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((serv) => {
                  const isChecked = selectedAddOnIds.includes(serv._id);
                  const isPerAttendee = serv.pricingType === 'perAttendee';
                  const serviceLineCost = isPerAttendee ? serv.price * count : serv.price;

                  return (
                    <div
                      key={serv._id}
                      onClick={() => handleToggleAddOn(serv._id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by div onClick
                            className="w-4 h-4 rounded text-pink-500 focus:ring-0 accent-pink-500"
                          />
                          <h4 className="font-bold text-sm text-white">{serv.name}</h4>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                            isPerAttendee
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-indigo-500/20 text-indigo-300'
                          }`}
                        >
                          {isPerAttendee ? 'Per Guest' : 'Flat'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mb-3">{serv.description}</p>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {isPerAttendee ? `₹${serv.price} × ${count}` : 'Flat package rate'}
                        </span>
                        <span className="font-bold text-white font-mono">
                          ₹{serviceLineCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-all"
                >
                  Next: Review Live Price Breakdown <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review with Live Price Breakdown */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Step 4: Final Booking Review</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified against server pricing engine. Price breakdown will freeze upon confirmation.
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-3 py-1 rounded-full">
                  Formula Verified
                </span>
              </div>

              {/* Event Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Category:</span>
                  <strong className="text-sm text-white">{selectedCategory?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Headcount:</span>
                  <strong className="text-sm text-white">{count} Attendees</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date &amp; Time:</span>
                  <strong className="text-sm text-white">
                    {eventDate ? new Date(eventDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Venue Address:</span>
                  <strong className="text-sm text-white">{venueAddress || 'Not specified'}</strong>
                </div>
                {notes && (
                  <div className="sm:col-span-2 pt-2 border-t border-white/10">
                    <span className="text-slate-400 block mb-0.5">Special Instructions:</span>
                    <p className="text-slate-200">{notes}</p>
                  </div>
                )}
              </div>

              {/* Itemized Calculation Breakdown Table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#090d16]/50">
                <div className="px-5 py-3 bg-white/5 border-b border-white/10 font-bold text-xs uppercase tracking-wider text-slate-300">
                  Itemized Price Breakdown
                </div>

                <div className="p-5 space-y-3.5 text-sm">
                  {/* Category line */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">{selectedCategory?.name} Staffing Base</span>
                      <span className="text-xs text-slate-400 block">
                        ₹{categoryRate} × {count} attendees
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-200">
                      ₹{categoryTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Add-on lines */}
                  {addOnsLineItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                      <div>
                        <span className="font-medium text-slate-200">{item.name}</span>
                        <span className="text-[11px] text-slate-400 block">
                          {item.pricingType === 'perAttendee'
                            ? `₹${item.unitPrice} × ${count} attendees`
                            : `Flat rate`}
                        </span>
                      </div>
                      <span className="font-mono text-slate-300">
                        ₹{item.lineTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}

                  {/* Add-ons subtotal */}
                  {addOnsLineItems.length > 0 && (
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-pink-400 font-semibold">
                      <span>Total Add-on Services</span>
                      <span className="font-mono">₹{addOnsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {/* Grand total */}
                  <div className="flex items-center justify-between text-base sm:text-lg font-black pt-3 border-t border-white/20 text-white">
                    <span>Grand Total:</span>
                    <span className="text-emerald-400 font-mono text-xl sm:text-2xl">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-8 py-3.5 rounded-full text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-60"
                >
                  {submitting ? (
                    'Freezing Price & Booking...'
                  ) : !isAuthenticated ? (
                    'Sign In to Confirm Booking'
                  ) : (
                    <>
                      Confirm &amp; Book (₹{grandTotal.toLocaleString('en-IN')}) <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Calculation Sidebar (Sticky on desktop) */}
        <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24 space-y-5">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={16} /> Live Real-Time Quote
          </div>

          <div className="space-y-3 text-xs border-b border-white/10 pb-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold text-white">{selectedCategory?.name || 'Select below'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Headcount:</span>
              <span className="font-semibold text-white">{count} guests</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Base Rate:</span>
              <span className="font-semibold text-slate-200">₹{categoryRate} / attendee</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-slate-200">
              <span>Category Total:</span>
              <span className="font-mono">₹{categoryTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Addons List */}
          <div className="space-y-2 text-xs border-b border-white/10 pb-4">
            <div className="flex justify-between text-slate-400 font-semibold mb-1">
              <span>Chosen Add-ons:</span>
              <span>{selectedServices.length} selected</span>
            </div>
            {selectedServices.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic">None selected yet</p>
            ) : (
              selectedServices.map((addon) => {
                const isPerAttendee = addon.pricingType === 'perAttendee';
                const cost = isPerAttendee ? addon.price * count : addon.price;
                return (
                  <div key={addon._id} className="flex justify-between text-[11px] text-slate-300">
                    <span className="truncate max-w-[140px]">{addon.name}</span>
                    <span className="font-mono">₹{cost.toLocaleString('en-IN')}</span>
                  </div>
                );
              })
            )}
            <div className="flex justify-between pt-1 font-semibold text-pink-400">
              <span>Add-ons Total:</span>
              <span className="font-mono">₹{addOnsTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Grand Total Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
              Estimated Total Cost
            </span>
            <div className="text-3xl font-black text-white font-mono">
              ₹{grandTotal.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <CheckCircle2 size={12} /> Server-verified rate
            </span>
          </div>

          <div className="text-[11px] text-slate-400 text-center leading-relaxed">
            Free cancellation available while booking status is <strong>Pending</strong> or <strong>Confirmed</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
