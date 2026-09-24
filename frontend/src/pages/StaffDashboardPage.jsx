import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { bookingAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const StaffDashboardPage = () => {
  const { user, showToast } = useAuth();
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAssigned();
  }, []);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getAssigned();
      if (res.success) {
        setAssignedBookings(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load assigned bookings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await bookingAPI.updateStatus(bookingId, newStatus);
      if (res.success) {
        showToast(`Event status updated to ${newStatus}!`, 'success');
        setAssignedBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading assigned events..." padding="120px 20px" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Briefcase size={16} /> Event Manager Workspace
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Events Assigned To You ({assignedBookings.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Welcome, {user?.name}. You only see bookings assigned directly to your staff profile.
        </p>
      </div>

      {assignedBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] border border-dashed border-white/10 rounded-3xl p-8">
          <Briefcase size={48} className="mx-auto text-indigo-400 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white">No active event assignments</h3>
          <p className="text-xs text-slate-400 mt-1">
            When administrators allocate you to manage functions, they will appear here with complete venue and customer briefs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {assignedBookings.map((b) => (
            <div
              key={b._id}
              className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl hover:border-indigo-500/40 transition-all space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <img
                    src={b.category?.image}
                    alt={b.category?.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{b.category?.name}</h2>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Function Date:{' '}
                      <strong className="text-indigo-300">
                        {new Date(b.eventDate).toLocaleString('en-US', {
                          dateStyle: 'full',
                          timeStyle: 'short',
                        })}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Status Updater */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  <select
                    value={b.status}
                    disabled={updatingId === b._id}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="assigned" className="bg-[#0f172a] text-indigo-300">
                      Assigned (In Progress)
                    </option>
                    <option value="completed" className="bg-[#0f172a] text-emerald-300">
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              {/* Event & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Venue & Logistics */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-400" /> Venue &amp; Logistics
                  </h3>
                  <div>
                    <span className="text-slate-400 block">Venue Location:</span>
                    <span className="font-semibold text-white text-sm">{b.venueAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Expected Headcount:</span>
                    <span className="font-semibold text-white text-sm">{b.attendeeCount} Guests</span>
                  </div>
                  {b.addOns && b.addOns.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-1">Requested Add-ons:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {b.addOns.map((addon) => (
                          <span
                            key={addon._id}
                            className="bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold text-[11px]"
                          >
                            {addon.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Contact Brief */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Users size={16} className="text-pink-400" /> Host Contact Brief
                  </h3>
                  <div>
                    <span className="text-slate-400 block">Client Host Name:</span>
                    <span className="font-semibold text-white text-sm">{b.customer?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Phone:</span>
                    <a
                      href={`tel:${b.customer?.phone}`}
                      className="font-bold text-indigo-400 hover:underline flex items-center gap-1.5 mt-0.5 text-sm"
                    >
                      <Phone size={14} /> {b.customer?.phone || 'Not provided'}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address:</span>
                    <span className="text-slate-300">{b.customer?.email}</span>
                  </div>
                </div>
              </div>

              {b.notes && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <strong>Client Instructions for On-Site Team:</strong> {b.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
