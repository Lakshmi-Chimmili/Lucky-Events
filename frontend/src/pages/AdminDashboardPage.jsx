import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import {
  bookingAPI,
  categoryAPI,
  serviceAPI,
  staffAPI,
} from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';

export const AdminDashboardPage = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Booking Filter
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // Modals States
  const [viewBooking, setViewBooking] = useState(null);
  const [assignBooking, setAssignBooking] = useState(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);

  // Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    basePricePerAttendee: 500,
    isActive: true,
  });

  // Service Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    image: '',
    pricingType: 'flat',
    price: 1000,
    isActive: true,
  });

  // Staff Modal
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, catsRes, servsRes, staffRes] = await Promise.all([
        bookingAPI.getStats(),
        bookingAPI.getAll(),
        categoryAPI.getAll(true),
        serviceAPI.getAll(true),
        staffAPI.getAll(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
      if (servsRes.success) setServices(servsRes.data);
      if (staffRes.success) setStaffList(staffRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to load admin records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- BOOKING ACTIONS ---
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const res = await bookingAPI.updateStatus(bookingId, status);
      if (res.success) {
        showToast(`Status updated to ${status}`, 'success');
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
        );
        // Refresh stats
        const statsRes = await bookingAPI.getStats();
        if (statsRes.success) setStats(statsRes.stats);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleOpenAssignModal = (booking) => {
    setAssignBooking(booking);
    setSelectedStaffIds(booking.assignedStaff?.map((s) => s._id) || []);
  };

  const handleSaveStaffAssignment = async () => {
    if (!assignBooking) return;
    try {
      const res = await bookingAPI.assignStaff(assignBooking._id, selectedStaffIds);
      if (res.success) {
        showToast('Staff assigned successfully!', 'success');
        setBookings((prev) =>
          prev.map((b) => (b._id === assignBooking._id ? res.data : b))
        );
        setAssignBooking(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to assign staff', 'error');
    }
  };

  // --- CATEGORY CRUD ---
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        name: cat.name,
        description: cat.description || '',
        image: cat.image || '',
        basePricePerAttendee: cat.basePricePerAttendee,
        isActive: cat.isActive,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        basePricePerAttendee: 500,
        isActive: true,
      });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await categoryAPI.update(editingCategory._id, categoryForm);
        if (res.success) {
          showToast('Category updated!', 'success');
          setCategories((prev) =>
            prev.map((c) => (c._id === editingCategory._id ? res.data : c))
          );
        }
      } else {
        const res = await categoryAPI.create(categoryForm);
        if (res.success) {
          showToast('Category created!', 'success');
          setCategories((prev) => [...prev, res.data]);
        }
      }
      setCategoryModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category permanently?')) return;
    try {
      const res = await categoryAPI.delete(id);
      if (res.success) {
        showToast('Category deleted.', 'info');
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  // --- SERVICE CRUD ---
  const handleOpenServiceModal = (serv = null) => {
    if (serv) {
      setEditingService(serv);
      setServiceForm({
        name: serv.name,
        description: serv.description || '',
        image: serv.image || '',
        pricingType: serv.pricingType,
        price: serv.price,
        isActive: serv.isActive,
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        pricingType: 'flat',
        price: 3000,
        isActive: true,
      });
    }
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        const res = await serviceAPI.update(editingService._id, serviceForm);
        if (res.success) {
          showToast('Service updated!', 'success');
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data : s))
          );
        }
      } else {
        const res = await serviceAPI.create(serviceForm);
        if (res.success) {
          showToast('Service created!', 'success');
          setServices((prev) => [...prev, res.data]);
        }
      }
      setServiceModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save service', 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this add-on service permanently?')) return;
    try {
      const res = await serviceAPI.delete(id);
      if (res.success) {
        showToast('Service deleted.', 'info');
        setServices((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  // --- STAFF CREATION ---
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await staffAPI.create(staffForm);
      if (res.success) {
        showToast('Staff account created!', 'success');
        setStaffList((prev) => [res.data, ...prev]);
        setStaffModalOpen(false);
        setStaffForm({ name: '', email: '', password: '', phone: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to create staff account', 'error');
    }
  };

  const filteredBookings = bookings.filter((b) =>
    bookingFilterStatus === 'all' ? true : b.status === bookingFilterStatus
  );

  if (loading) {
    return <LoadingSpinner label="Loading admin cockpit..." padding="120px 20px" />;
  }

  const tabs = [
    { key: 'stats', label: 'Stats Overview', icon: <BarChart3 size={16} /> },
    { key: 'bookings', label: `Bookings (${bookings.length})`, icon: <Calendar size={16} /> },
    { key: 'categories', label: `Categories (${categories.length})`, icon: <Layers size={16} /> },
    { key: 'services', label: `Add-ons (${services.length})`, icon: <Sparkles size={16} /> },
    { key: 'staff', label: `Staff Team (${staffList.length})`, icon: <Users size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck size={16} /> Administrator Cockpit
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Administration</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage live event categories, add-on pricing, staff allocations, and client reservations.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'categories' && (
            <button
              onClick={() => handleOpenCategoryModal()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
            >
              <PlusCircle size={15} /> Add Category
            </button>
          )}
          {activeTab === 'services' && (
            <button
              onClick={() => handleOpenServiceModal()}
              className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
            >
              <PlusCircle size={15} /> Add Service
            </button>
          )}
          {activeTab === 'staff' && (
            <button
              onClick={() => setStaffModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
            >
              <UserPlus size={15} /> Add Staff Account
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: STATS OVERVIEW */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Revenue</span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
                ₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Confirmed &amp; Completed</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Bookings</span>
              <div className="text-3xl font-black text-white font-mono mt-2">
                {stats.totalBookings || 0}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Across all categories</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pending Review</span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-2">
                {stats.pending || 0}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Action required</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Staff Members</span>
              <div className="text-3xl font-black text-indigo-400 font-mono mt-2">
                {stats.staffCount || 0}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Ready for assignment</span>
            </div>
          </div>

          {/* Status Breakdown Grid */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-base">Booking Pipeline Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-amber-400 font-bold uppercase">Pending</span>
                <span className="text-xl font-bold text-white block mt-1">{stats.pending || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-blue-400 font-bold uppercase">Confirmed</span>
                <span className="text-xl font-bold text-white block mt-1">{stats.confirmed || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-indigo-400 font-bold uppercase">Assigned</span>
                <span className="text-xl font-bold text-white block mt-1">{stats.assigned || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-emerald-400 font-bold uppercase">Completed</span>
                <span className="text-xl font-bold text-white block mt-1">{stats.completed || 0}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-xs text-rose-400 font-bold uppercase">Cancelled</span>
                <span className="text-xl font-bold text-white block mt-1">{stats.cancelled || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'pending', 'confirmed', 'assigned', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setBookingFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  bookingFilterStatus === st ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 text-slate-400 uppercase text-[11px] font-bold border-b border-white/10">
                  <tr>
                    <th className="p-4">Customer &amp; Category</th>
                    <th className="p-4">Date &amp; Venue</th>
                    <th className="p-4">Attendees</th>
                    <th className="p-4">Frozen Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned Staff</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <strong className="text-white text-sm block">{b.customer?.name}</strong>
                        <span className="text-slate-400">{b.customer?.email}</span>
                        <div className="text-indigo-400 font-semibold mt-0.5">{b.category?.name}</div>
                      </td>

                      <td className="p-4">
                        <span className="text-white block font-medium">
                          {new Date(b.eventDate).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                        <span className="text-slate-400 truncate max-w-[180px] block">{b.venueAddress}</span>
                      </td>

                      <td className="p-4 font-bold text-white">
                        {b.attendeeCount} guests
                      </td>

                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        ₹{b.priceBreakdown?.grandTotal?.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                          className="bg-white/5 border border-white/15 rounded-lg px-2 py-1 text-xs font-semibold text-white focus:border-indigo-500 outline-none"
                        >
                          <option value="pending" className="bg-[#0f172a]">pending</option>
                          <option value="confirmed" className="bg-[#0f172a]">confirmed</option>
                          <option value="assigned" className="bg-[#0f172a]">assigned</option>
                          <option value="completed" className="bg-[#0f172a]">completed</option>
                          <option value="cancelled" className="bg-[#0f172a]">cancelled</option>
                        </select>
                      </td>

                      <td className="p-4">
                        {b.assignedStaff && b.assignedStaff.length > 0 ? (
                          <div className="space-y-0.5">
                            {b.assignedStaff.map((s) => (
                              <span key={s._id} className="text-indigo-300 font-bold block">
                                {s.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">None</span>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(b)}
                          className="bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white px-2.5 py-1 rounded text-xs font-bold"
                        >
                          Assign Staff
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewBooking(b)}
                          className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded text-xs font-bold"
                        >
                          Breakdown
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="h-40 rounded-xl overflow-hidden relative mb-3">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                <div className="mt-3 text-xs text-indigo-400 font-bold">
                  Base Rate: ₹{cat.basePricePerAttendee} / attendee
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenCategoryModal(cat)}
                  className="text-indigo-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-rose-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((serv) => (
            <div
              key={serv._id}
              className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{serv.name}</h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {serv.pricingType}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{serv.description}</p>
                <div className="mt-3 text-sm font-black text-pink-400 font-mono">
                  ₹{serv.price.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    {serv.pricingType === 'flat' ? 'flat rate' : '/ attendee'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleOpenServiceModal(serv)}
                  className="text-pink-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteService(serv._id)}
                  className="text-rose-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: STAFF MANAGEMENT */}
      {activeTab === 'staff' && (
        <div className="bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-slate-400 uppercase text-[11px] font-bold border-b border-white/10">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {staffList.map((s) => (
                <tr key={s._id} className="hover:bg-white/5">
                  <td className="p-4 font-bold text-white text-sm">{s.name}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4 text-slate-300">{s.phone || 'N/A'}</td>
                  <td className="p-4">
                    <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                      {s.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ASSIGN STAFF MODAL */}
      <Modal
        isOpen={!!assignBooking}
        onClose={() => setAssignBooking(null)}
        title="Assign Staff / Event Manager"
        maxWidth="500px"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Select one or more verified event managers to run{' '}
            <strong className="text-white">{assignBooking?.category?.name}</strong>:
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {staffList.map((st) => {
              const isChecked = selectedStaffIds.includes(st._id);
              return (
                <label
                  key={st._id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                    isChecked
                      ? 'bg-indigo-500/20 border-indigo-500 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setSelectedStaffIds((prev) =>
                          e.target.checked
                            ? [...prev, st._id]
                            : prev.filter((id) => id !== st._id)
                        );
                      }}
                      className="accent-indigo-600 rounded"
                    />
                    <div>
                      <strong className="block text-sm">{st.name}</strong>
                      <span className="text-slate-400 text-[11px]">{st.email} &bull; {st.phone}</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setAssignBooking(null)}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-white/10 text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveStaffAssignment}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Save Staff Assignment
            </button>
          </div>
        </div>
      </Modal>

      {/* VIEW BREAKDOWN MODAL */}
      <Modal
        isOpen={!!viewBooking}
        onClose={() => setViewBooking(null)}
        title="Frozen Booking Breakdown"
        maxWidth="500px"
      >
        {viewBooking && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Host Client:</span>
                <span className="font-bold text-white">
                  {viewBooking.customer?.name} {viewBooking.customer?.phone ? `(${viewBooking.customer.phone})` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-white">
                  {viewBooking.priceBreakdown?.categoryName || viewBooking.category?.name || 'Event Staffing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category Calculation:</span>
                <span className="font-mono text-slate-200">
                  ₹{viewBooking.priceBreakdown?.basePricePerAttendee || viewBooking.category?.basePricePerAttendee || 0} × {viewBooking.attendeeCount} guests
                </span>
              </div>
              <div className="flex justify-between font-bold text-indigo-400 pt-1 border-t border-white/5">
                <span>Category Total:</span>
                <span className="font-mono">
                  ₹{(viewBooking.priceBreakdown?.categoryTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
              <span className="font-bold text-slate-300 block mb-1">Add-ons Itemized</span>
              {viewBooking.priceBreakdown?.addOnsBreakdown &&
              viewBooking.priceBreakdown.addOnsBreakdown.length > 0 ? (
                viewBooking.priceBreakdown.addOnsBreakdown.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-300">
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

            <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Frozen Grand Total</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ₹{(viewBooking.priceBreakdown?.grandTotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs font-bold text-white uppercase bg-white/10 px-2.5 py-1 rounded">
                Status: {viewBooking.status}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* CATEGORY CREATE/EDIT MODAL */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Base Price Per Attendee (₹) *</label>
            <input
              type="number"
              min="0"
              required
              value={categoryForm.basePricePerAttendee}
              onChange={(e) => setCategoryForm({ ...categoryForm, basePricePerAttendee: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Image URL</label>
            <input
              type="url"
              value={categoryForm.image}
              onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={categoryForm.isActive}
              onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
              className="accent-indigo-600 rounded"
            />
            Category is Active &amp; Bookable
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>

      {/* SERVICE CREATE/EDIT MODAL */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService ? 'Edit Add-On Service' : 'Create Add-On Service'}
        maxWidth="500px"
      >
        <form onSubmit={handleSaveService} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Service Name *</label>
            <input
              type="text"
              required
              value={serviceForm.name}
              onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Pricing Model *</label>
              <select
                value={serviceForm.pricingType}
                onChange={(e) => setServiceForm({ ...serviceForm, pricingType: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-2.5 text-white"
              >
                <option value="flat">Flat Package Rate</option>
                <option value="perAttendee">Per Attendee Rate</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Price (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Image URL</label>
            <input
              type="url"
              value={serviceForm.image}
              onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Description</label>
            <textarea
              rows={3}
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-slate-300 font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={serviceForm.isActive}
              onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
              className="accent-pink-600 rounded"
            />
            Service is Active &amp; Selectable
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setServiceModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold"
            >
              Save Service
            </button>
          </div>
        </form>
      </Modal>

      {/* STAFF CREATION MODAL */}
      <Modal
        isOpen={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        title="Create Staff Member Account"
        maxWidth="460px"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Staff Full Name *</label>
            <input
              type="text"
              required
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={staffForm.email}
              onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Contact Phone</label>
            <input
              type="tel"
              value={staffForm.phone}
              onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Temporary Password (min 6 chars) *</label>
            <input
              type="password"
              minLength={6}
              required
              value={staffForm.password}
              onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStaffModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
