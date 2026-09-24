import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  AlertCircle,
  PlusCircle,
  ChevronDown,
  XCircle,
  Clock,
  Phone,
  User,
  CheckCircle,
} from 'lucide-react';
import { bookingAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';

export const CustomerDashboardPage = () => {
  const { user, showToast } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetBooking, setTargetBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Breakdown modal state
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getMy();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!targetBooking) return;
    setCancelling(true);
    try {
      const res = await bookingAPI.updateStatus(targetBooking._id, 'cancelled');
      if (res.success) {
        showToast('Booking has been cancelled.', 'info');
        setBookings((prev) =>
          prev.map((b) => (b._id === targetBooking._id ? { ...b, status: 'cancelled' } : b))
        );
        setCancelModalOpen(false);
        setTargetBooking(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) =>
    filterStatus === 'all' ? true : b.status === filterStatus
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">Pending Review</span>;
      case 'confirmed':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">Confirmed</span>;
      case 'assigned':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">Staff Assigned</span>;
      case 'completed':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase">Cancelled</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your event reservations..." padding="120px 20px" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">My Event Bookings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your reserved functions, view frozen pricing, and check assigned event managers.
          </p>
        </div>

        <Link
          to="/book"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
        >
          <PlusCircle size={16} /> Book Another Event
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-white/10">
        {['all', 'pending', 'confirmed', 'assigned', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              filterStatus === tab
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] border border-dashed border-white/10 rounded-3xl p-8">
          <Ticket size={48} className="mx-auto text-indigo-400 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white">No bookings found</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            You don't have any bookings under the "{filterStatus}" filter.
          </p>
          <Link
            to="/book"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-full"
          >
            Start Booking Wizard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((b) => {
            const canCancel = ['pending', 'confirmed'].includes(b.status);
            return (
              <div
                key={b._id}
                className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-7 hover:border-white/20 transition-all shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <img
                      src={b.category?.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'}
                      alt={b.category?.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">{b.category?.name}</h2>
                        {getStatusBadge(b.status)}
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Booking ID: <span className="font-mono text-slate-300">{b._id}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Frozen Grand Total</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      ₹{b.priceBreakdown?.grandTotal?.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Event Date &amp; Time</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Calendar size={14} className="text-indigo-400" />
                      {new Date(b.eventDate).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Headcount &amp; Venue</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Users size={14} className="text-indigo-400" />
                      {b.attendeeCount} Guests
                    </span>
                    <span className="text-slate-300 block truncate mt-0.5">
                      {b.venueAddress}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Assigned Staff / Manager</span>
                    {b.assignedStaff && b.assignedStaff.length > 0 ? (
                      b.assignedStaff.map((staff) => (
                        <div key={staff._id} className="text-indigo-300 font-bold flex items-center gap-1.5">
                          <User size={13} /> {staff.name} {staff.phone ? `(${staff.phone})` : ''}
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">Pending manager assignment</span>
                    )}
                  </div>
                </div>

                {b.notes && (
                  <div className="p-3 rounded-xl bg-white/5 text-xs text-slate-300 mb-5">
                    <strong>Special Instructions:</strong> {b.notes}
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setViewBooking(b);
                      setBreakdownModalOpen(true);
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    View Itemized Price Breakdown &rarr;
                  </button>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => {
                        setTargetBooking(b);
                        setCancelModalOpen(true);
                      }}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3.5 py-1.5 rounded-full transition-all"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Event Reservation"
        maxWidth="460px"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to cancel your booking for{' '}
            <strong className="text-white">{targetBooking?.category?.name}</strong>?
          </p>
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            Cancellation is permitted free of charge while your status is Pending or Confirmed.
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={handleCancelBooking}
              disabled={cancelling}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
            >
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Frozen Price Breakdown Modal */}
      <Modal
        isOpen={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        title="Frozen Price Breakdown"
        maxWidth="500px"
      >
        {viewBooking && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-white">
                  {viewBooking.priceBreakdown?.categoryName || viewBooking.category?.name || 'Event Staffing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rate per Attendee:</span>
                <span className="font-mono text-slate-200">
                  ₹{viewBooking.priceBreakdown?.basePricePerAttendee || viewBooking.category?.basePricePerAttendee || 0} × {viewBooking.attendeeCount} guests
                </span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1 border-t border-white/5">
                <span>Category Total:</span>
                <span className="font-mono text-indigo-400">
                  ₹{(viewBooking.priceBreakdown?.categoryTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2">
              <span className="font-bold text-slate-300 block mb-1">Add-On Services Breakdown</span>
              {viewBooking.priceBreakdown?.addOnsBreakdown &&
              viewBooking.priceBreakdown.addOnsBreakdown.length > 0 ? (
                viewBooking.priceBreakdown.addOnsBreakdown.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-300 pt-1 border-t border-white/5">
                    <span>
                      {item.name} ({item.pricingType})
                    </span>
                    <span className="font-mono">₹{(item.lineTotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">No add-ons selected</span>
              )}
              <div className="flex justify-between font-bold text-pink-400 pt-1 border-t border-white/5">
                <span>Add-ons Total:</span>
                <span className="font-mono">
                  ₹{(viewBooking.priceBreakdown?.addOnsTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-bold">Grand Total</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{(viewBooking.priceBreakdown?.grandTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded">
                Frozen at Creation
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
