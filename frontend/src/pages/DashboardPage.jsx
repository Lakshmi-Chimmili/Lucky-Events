import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  Users,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Send,
  CheckCircle,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const DashboardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 20px;

  .greeting {
    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 6px;
    }
    p {
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 0.95rem;
    }
  }
`;

const CreateBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff !important;
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TabsNav = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 32px;
`;

const TabButton = styled.button`
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 700;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  position: relative;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: ${theme.colors.primary};
      border-radius: 3px 3px 0 0;
    }
  `}
`;

const EventsTable = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.5fr 2fr;
  padding: 16px 24px;
  background: rgba(15, 23, 42, 0.6);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 3fr 1.5fr 1.5fr 2fr;
  padding: 20px 24px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

const EventTitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
  }

  .title {
    font-weight: 700;
    color: #fff;
    font-size: 1rem;
    margin-bottom: 4px;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .sub {
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  a, button {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: ${({ theme }) => theme.transitions.fast};
  }

  .view-btn {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    &:hover { background: rgba(255, 255, 255, 0.12); }
  }

  .edit-btn {
    background: rgba(99, 102, 241, 0.15);
    color: #a5b4fc;
    &:hover { background: rgba(99, 102, 241, 0.25); }
  }

  .del-btn {
    background: rgba(244, 63, 94, 0.1);
    color: #f43f5e;
    &:hover { background: rgba(244, 63, 94, 0.2); }
  }
`;

// RSVPs Cards Grid
const RSVPsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const RSVPCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .code {
      font-family: ${({ theme }) => theme.fonts.mono};
      font-weight: 700;
      color: ${({ theme }) => theme.colors.primary};
      font-size: 0.95rem;
      background: rgba(99, 102, 241, 0.1);
      padding: 4px 10px;
      border-radius: 6px;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 99px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }
  }

  .title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 8px;
  }

  .footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};

  h3 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 20px;
  }
`;

export const DashboardPage = () => {
  const { user, showToast } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'events';

  const [stats, setStats] = useState({ eventsOrganized: 0, eventsAttending: 0, totalAttendeesReceived: 0 });
  const [myEvents, setMyEvents] = useState([]);
  const [myRSVPs, setMyRSVPs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteEventId, setDeleteEventId] = useState(null);
  const [cancelRSVPEventId, setCancelRSVPEventId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes, rsvpsRes] = await Promise.all([
        api.user.getStats(),
        api.events.getMyEvents(),
        api.rsvps.getMyRSVPs(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (eventsRes.success) setMyEvents(eventsRes.data);
      if (rsvpsRes.success) setMyRSVPs(rsvpsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const confirmDeleteEvent = async () => {
    if (!deleteEventId) return;
    try {
      const res = await api.events.delete(deleteEventId);
      if (res.success) {
        showToast('Event deleted successfully.', 'success');
        setMyEvents((prev) => prev.filter((e) => e._id !== deleteEventId));
        setStats((prev) => ({ ...prev, eventsOrganized: prev.eventsOrganized - 1 }));
        setDeleteEventId(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  const confirmCancelRSVP = async () => {
    if (!cancelRSVPEventId) return;
    try {
      const res = await api.rsvps.cancel(cancelRSVPEventId);
      if (res.success) {
        showToast('Reservation cancelled.', 'info');
        setMyRSVPs((prev) => prev.filter((r) => r.event?._id !== cancelRSVPEventId));
        setStats((prev) => ({ ...prev, eventsAttending: prev.eventsAttending - 1 }));
        setCancelRSVPEventId(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel reservation', 'error');
    }
  };

  const handleSendReminder = async (eventId) => {
    try {
      const res = await api.events.sendReminders(eventId);
      if (res.success) {
        showToast(res.message, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to send reminders', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading your dashboard..." padding="120px 20px" />;
  }

  return (
    <Container>
      <DashboardHeader>
        <div className="greeting">
          <h1>Welcome, {user?.name}</h1>
          <p>Manage your hosted events, check registrations, and view your tickets</p>
        </div>
        <CreateBtn to="/create-event">
          <PlusCircle size={18} />
          Create New Event
        </CreateBtn>
      </DashboardHeader>

      <StatsGrid>
        <StatCard
          icon={<Calendar size={24} />}
          value={stats.eventsOrganized}
          label="Events Hosted"
          color="#6366f1"
        />
        <StatCard
          icon={<Users size={24} />}
          value={stats.totalAttendeesReceived}
          label="Total Attendees Registered"
          color="#10b981"
        />
        <StatCard
          icon={<Ticket size={24} />}
          value={stats.eventsAttending}
          label="My Active Reservations"
          color="#ec4899"
        />
      </StatsGrid>

      <TabsNav>
        <TabButton
          $active={currentTab === 'events'}
          onClick={() => setTab('events')}
        >
          Events I'm Organizing ({myEvents.length})
        </TabButton>
        <TabButton
          $active={currentTab === 'rsvps'}
          onClick={() => setTab('rsvps')}
        >
          My RSVPs &amp; Tickets ({myRSVPs.length})
        </TabButton>
      </TabsNav>

      {currentTab === 'events' ? (
        myEvents.length === 0 ? (
          <EmptyState>
            <Calendar size={48} color="#6366f1" style={{ marginBottom: 16 }} />
            <h3>You haven't created any events yet</h3>
            <p>Publish your first summit or meetup to start accepting RSVPs.</p>
            <CreateBtn to="/create-event">Create Your First Event</CreateBtn>
          </EmptyState>
        ) : (
          <EventsTable>
            <TableHeader>
              <div>Event</div>
              <div>Date &amp; Time</div>
              <div>Attendees / Capacity</div>
              <div>Actions</div>
            </TableHeader>

            {myEvents.map((evt) => (
              <TableRow key={evt._id}>
                <EventTitleCell>
                  <img src={evt.bannerImage} alt={evt.title} />
                  <div>
                    <Link to={`/events/${evt._id}`} className="title">
                      {evt.title}
                    </Link>
                    <div className="sub">{evt.category} &bull; {evt.isVirtual ? 'Virtual' : evt.location}</div>
                  </div>
                </EventTitleCell>

                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  {new Date(evt.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <strong>{evt.rsvpCount}</strong> / {evt.capacity} spots
                </div>

                <ActionButtons>
                  <Link to={`/events/${evt._id}`} className="view-btn">
                    View
                  </Link>
                  <Link to={`/edit-event/${evt._id}`} className="edit-btn">
                    <Edit size={14} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleSendReminder(evt._id)}
                    title="Send Email Reminder to Attendees"
                    style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}
                  >
                    <Send size={14} /> Remind
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteEventId(evt._id)}
                    className="del-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                </ActionButtons>
              </TableRow>
            ))}
          </EventsTable>
        )
      ) : (
        myRSVPs.length === 0 ? (
          <EmptyState>
            <Ticket size={48} color="#ec4899" style={{ marginBottom: 16 }} />
            <h3>No reservations found</h3>
            <p>Explore upcoming events and reserve your spot with 1 click!</p>
            <Link
              to="/events"
              style={{
                display: 'inline-block',
                background: '#6366f1',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: 99,
                fontWeight: 600,
              }}
            >
              Browse Events
            </Link>
          </EmptyState>
        ) : (
          <RSVPsGrid>
            {myRSVPs.map((r) => (
              <RSVPCard key={r._id}>
                <div className="ticket-header">
                  <span className="code">{r.ticketCode}</span>
                  <span className="badge">{r.status}</span>
                </div>

                <div className="title">{r.event?.title}</div>

                <div className="meta-row">
                  <Calendar size={16} />
                  <span>
                    {new Date(r.event?.startDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="meta-row">
                  <MapPin size={16} />
                  <span>{r.event?.isVirtual ? 'Virtual Webinar' : r.event?.location}</span>
                </div>

                <div className="meta-row">
                  <Users size={16} />
                  <span>Guests: {r.guestCount} ticket(s)</span>
                </div>

                <div className="footer">
                  <Link
                    to={`/events/${r.event?._id}`}
                    style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}
                  >
                    Event Details &rarr;
                  </Link>

                  <button
                    type="button"
                    onClick={() => setCancelRSVPEventId(r.event?._id)}
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      color: '#f43f5e',
                      padding: '6px 14px',
                      borderRadius: 6,
                      fontSize: '0.82rem',
                      fontWeight: 600,
                    }}
                  >
                    Cancel RSVP
                  </button>
                </div>
              </RSVPCard>
            ))}
          </RSVPsGrid>
        )
      )}

      {/* Delete Event Modal */}
      <Modal
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        title="Delete Event Confirmation"
        maxWidth="440px"
      >
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>
          Are you sure you want to permanently delete this event? This will remove all attendee RSVPs and cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setDeleteEventId(null)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Keep Event
          </button>
          <button
            onClick={confirmDeleteEvent}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: '#f43f5e',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Delete Event
          </button>
        </div>
      </Modal>

      {/* Cancel Reservation Modal */}
      <Modal
        isOpen={!!cancelRSVPEventId}
        onClose={() => setCancelRSVPEventId(null)}
        title="Cancel Reservation"
        maxWidth="440px"
      >
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>
          Are you sure you want to cancel your reservation? Your ticket code will be invalidated and your seat returned to available capacity.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setCancelRSVPEventId(null)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Keep Ticket
          </button>
          <button
            onClick={confirmCancelRSVP}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: '#f43f5e',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Confirm Cancellation
          </button>
        </div>
      </Modal>
    </Container>
  );
};
