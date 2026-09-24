import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Share2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Edit,
  Trash2,
  Send,
  Ticket,
  ChevronLeft,
  CalendarPlus,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 30px 24px 80px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 24px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    transform: translateX(-4px);
  }
`;

const HeroCard = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  height: 380px;
  margin-bottom: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 260px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(9, 13, 22, 0.2) 0%, rgba(9, 13, 22, 0.95) 100%);
  }

  .badges {
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    gap: 10px;
  }
`;

const CategoryBadge = styled.span`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
`;

const PriceTag = styled.span`
  background: ${({ $isFree }) =>
    $isFree
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'};
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 6px 16px;
  border-radius: 99px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 36px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const EventHeader = styled.div`
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 20px;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: 1.9rem;
    }
  }
`;

const QuickInfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentSection = styled.div`
  h2 {
    font-size: 1.45rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    font-size: 1.05rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.8;
    white-space: pre-line;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const OrganizerCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;

  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.primary};
  }

  .meta {
    .name {
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
    }
    .org {
      font-size: 0.88rem;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
    }
    .bio {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.colors.textSecondary};
      margin-top: 4px;
    }
  }
`;

// Right Column / Sticky RSVP Box
const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RSVPBox = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 30px;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: sticky;
  top: 96px;
`;

const CapacityBar = styled.div`
  margin-bottom: 24px;

  .header {
    display: flex;
    justify-content: space-between;
    font-size: 0.88rem;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  .track {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 99px;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    background: ${({ $isFull, theme }) =>
      $isFull ? theme.colors.rose : 'linear-gradient(90deg, #6366f1, #06b6d4)'};
    width: ${({ $percentage }) => Math.min(100, $percentage)}%;
  }
`;

const ActivePass = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  margin-bottom: 20px;

  .status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #10b981;
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 12px;
  }

  .code-box {
    background: #090d16;
    border: 1px dashed rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 10px 14px;
    text-align: center;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }

  .details {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const RSVPForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.88rem;
    font-weight: 600;
  }

  select, textarea {
    padding: 12px 14px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: #fff;
    font-size: 0.95rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const RSVPButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelRSVPButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #f43f5e;
  font-weight: 600;
  font-size: 0.95rem;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(244, 63, 94, 0.2);
  }
`;

// Organizer Action Panel
const OrganizerPanel = styled.div`
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #a5b4fc;
  }

  .btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button, a {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 14px;
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: 0.85rem;
    font-weight: 600;
    transition: ${({ theme }) => theme.transitions.fast};
  }

  .edit-btn {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    &:hover { background: rgba(255, 255, 255, 0.15); }
  }

  .delete-btn {
    background: rgba(244, 63, 94, 0.15);
    color: #f43f5e;
    &:hover { background: rgba(244, 63, 94, 0.25); }
  }

  .reminder-btn {
    width: 100%;
    background: #6366f1;
    color: #fff;
    &:hover { background: #4f46e5; }
  }
`;

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, showToast } = useAuth();

  const [event, setEvent] = useState(null);
  const [userRSVP, setUserRSVP] = useState(null);
  const [recentAttendees, setRecentAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // RSVP Form state
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [submittingRSVP, setSubmittingRSVP] = useState(false);

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [attendeeRoster, setAttendeeRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await api.events.getById(id);
      if (res.success) {
        setEvent(res.event);
        setUserRSVP(res.userRSVP);
        setRecentAttendees(res.recentAttendees || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setSubmittingRSVP(true);
    try {
      const res = await api.rsvps.rsvp(id, { guestCount, notes });
      if (res.success) {
        setUserRSVP(res.rsvp);
        setEvent((prev) => ({ ...prev, rsvpCount: res.updatedRsvpCount }));
        showToast(res.message, 'success');

        // Trigger confetti celebration!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setPassModalOpen(true);
      }
    } catch (err) {
      showToast(err.message || 'RSVP submission failed', 'error');
    } finally {
      setSubmittingRSVP(false);
    }
  };

  const handleCancelRSVP = async () => {
    try {
      const res = await api.rsvps.cancel(id);
      if (res.success) {
        setUserRSVP(null);
        setEvent((prev) => ({ ...prev, rsvpCount: res.updatedRsvpCount }));
        setCancelModalOpen(false);
        showToast(res.message, 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel RSVP', 'error');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const res = await api.events.delete(id);
      if (res.success) {
        showToast('Event has been deleted.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  const handleSendReminders = async () => {
    try {
      const res = await api.events.sendReminders(id);
      if (res.success) {
        showToast(res.message, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to send reminders', 'error');
    }
  };

  const handleOpenRoster = async () => {
    setRosterModalOpen(true);
    setRosterLoading(true);
    try {
      const res = await api.rsvps.getEventRSVPs(id);
      if (res.success) {
        setAttendeeRoster(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Could not fetch attendee roster', 'error');
    } finally {
      setRosterLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard! 📋', 'success');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading event experience..." padding="120px 20px" />;
  }

  if (!event) {
    return (
      <Container style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Event Not Found</h2>
        <p style={{ color: '#94a3b8', margin: '16px 0 24px' }}>
          This event may have been removed or does not exist.
        </p>
        <Link to="/events" style={{ color: '#6366f1', fontWeight: 600 }}>
          &larr; Back to Events Explorer
        </Link>
      </Container>
    );
  }

  const isOrganizer = user && (user.id === event.organizer?._id || user.id === event.organizer || user.role === 'admin');
  const isFree = event.ticketType === 'Free' || event.price === 0;
  const isSoldOut = event.rsvpCount >= event.capacity;
  const fillPercentage = Math.round(((event.rsvpCount || 0) / (event.capacity || 100)) * 100);

  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Container>
      <BackLink to="/events">
        <ChevronLeft size={18} />
        Back to all events
      </BackLink>

      <HeroCard>
        <img src={event.bannerImage} alt={event.title} />
        <div className="overlay" />
        <div className="badges">
          <CategoryBadge>{event.category}</CategoryBadge>
          <PriceTag $isFree={isFree}>
            {isFree ? 'FREE ENTRY' : `$${event.price} TICKET`}
          </PriceTag>
        </div>
      </HeroCard>

      <MainGrid>
        <LeftCol>
          <EventHeader>
            <h1>{event.title}</h1>
            <QuickInfoRow>
              <InfoItem>
                <Calendar size={18} />
                <span>{formattedDate}</span>
              </InfoItem>
              <InfoItem>
                <Clock size={18} />
                <span>{event.time || 'Schedule listed below'}</span>
              </InfoItem>
              <InfoItem>
                {event.isVirtual ? <Video size={18} /> : <MapPin size={18} />}
                <span>{event.isVirtual ? 'Virtual Stream' : event.location}</span>
              </InfoItem>
            </QuickInfoRow>
          </EventHeader>

          {/* Virtual Join link shown to confirmed attendees */}
          {event.isVirtual && userRSVP && userRSVP.status === 'attending' && event.virtualMeetingUrl && (
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <strong style={{ color: '#06b6d4', display: 'block' }}>Virtual Webinar Link:</strong>
                <a
                  href={event.virtualMeetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#fff', fontSize: '0.92rem', textDecoration: 'underline' }}
                >
                  {event.virtualMeetingUrl}
                </a>
              </div>
              <a
                href={event.virtualMeetingUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#06b6d4',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Join Now <ExternalLink size={14} />
              </a>
            </div>
          )}

          <ContentSection>
            <h2>About This Event</h2>
            <p>{event.description}</p>

            {event.tags && event.tags.length > 0 && (
              <TagsRow>
                {event.tags.map((tag, idx) => (
                  <Tag key={idx}>#{tag}</Tag>
                ))}
              </TagsRow>
            )}
          </ContentSection>

          {/* Organizer Card */}
          <ContentSection>
            <h2>Presented by Organizer</h2>
            <OrganizerCard>
              <img
                src={
                  event.organizer?.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    event.organizer?.name || 'Organizer'
                  )}`
                }
                alt={event.organizer?.name}
              />
              <div className="meta">
                <div className="name">{event.organizer?.name}</div>
                {event.organizer?.organization && (
                  <div className="org">{event.organizer.organization}</div>
                )}
                {event.organizer?.bio && <div className="bio">{event.organizer.bio}</div>}
              </div>
            </OrganizerCard>
          </ContentSection>

          {/* Recent Attendees preview */}
          {recentAttendees && recentAttendees.length > 0 && (
            <ContentSection>
              <h2>Who's Attending ({event.rsvpCount})</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {recentAttendees.map((att, i) => (
                  <img
                    key={i}
                    src={att.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${i}`}
                    alt={att.user?.name || 'Attendee'}
                    title={att.user?.name}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      border: '2px solid #1e293b',
                    }}
                  />
                ))}
                {event.rsvpCount > recentAttendees.length && (
                  <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                    +{event.rsvpCount - recentAttendees.length} more guests
                  </span>
                )}
              </div>
            </ContentSection>
          )}
        </LeftCol>

        {/* Right Sticky Action Column */}
        <RightCol>
          <RSVPBox>
            <CapacityBar>
              <div className="header">
                <span>
                  <Users size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {isSoldOut ? 'Capacity Full' : `${event.capacity - (event.rsvpCount || 0)} spots remaining`}
                </span>
                <span>{fillPercentage}%</span>
              </div>
              <div className="track">
                <div className="fill" style={{ width: `${Math.min(100, fillPercentage)}%` }} />
              </div>
            </CapacityBar>

            {/* If user is already RSVP'd */}
            {userRSVP && userRSVP.status !== 'cancelled' ? (
              <>
                <ActivePass>
                  <div className="status-row">
                    <CheckCircle2 size={20} />
                    <span>
                      {userRSVP.status === 'attending' ? 'RSVP Confirmed' : 'Waitlisted'}
                    </span>
                  </div>
                  <div className="code-box">{userRSVP.ticketCode}</div>
                  <div className="details">
                    <div>Guests booked: <strong>{userRSVP.guestCount}</strong></div>
                    <div>A pass has been sent to your email.</div>
                  </div>
                </ActivePass>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => setPassModalOpen(true)}
                    style={{
                      padding: 12,
                      background: '#6366f1',
                      color: '#fff',
                      borderRadius: 10,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Ticket size={18} /> View Ticket Pass
                  </button>
                  <CancelRSVPButton onClick={() => setCancelModalOpen(true)}>
                    Cancel My Reservation
                  </CancelRSVPButton>
                </div>
              </>
            ) : (
              /* RSVP Form */
              <RSVPForm onSubmit={handleRSVP}>
                <FormField>
                  <label>Select Guest Count</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                  >
                    <option value={1}>1 Guest (Myself)</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                    <option value={5}>5 Guests</option>
                  </select>
                </FormField>

                <FormField>
                  <label>Notes for Organizer (Optional)</label>
                  <textarea
                    placeholder="Dietary requirements or special requests..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </FormField>

                <RSVPButton type="submit" disabled={submittingRSVP}>
                  {submittingRSVP ? (
                    'Securing Spot...'
                  ) : !isAuthenticated ? (
                    'Sign In to RSVP'
                  ) : isSoldOut ? (
                    'Join Waitlist'
                  ) : (
                    'Confirm My RSVP'
                  )}
                </RSVPButton>
              </RSVPForm>
            )}

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                onClick={handleShare}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
              >
                <Share2 size={16} /> Share Event Link
              </button>
            </div>
          </RSVPBox>

          {/* Organizer Control Box (if owner or admin) */}
          {isOrganizer && (
            <OrganizerPanel>
              <div className="title">Organizer Controls</div>
              <div className="btns">
                <Link to={`/edit-event/${event._id || event.id}`} className="edit-btn">
                  <Edit size={15} /> Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="delete-btn"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendReminders}
                className="reminder-btn"
              >
                <Send size={15} /> Send Reminders Now
              </button>

              <button
                type="button"
                onClick={handleOpenRoster}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Users size={15} /> View Full Attendee Roster
              </button>
            </OrganizerPanel>
          )}
        </RightCol>
      </MainGrid>

      {/* Ticket Pass Modal */}
      <Modal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        title="Your Official Event Pass"
        maxWidth="460px"
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Ticket size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 6 }}>You're Confirmed!</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>
            Present this ticket pass or barcode upon arrival at the venue.
          </p>

          <div
            style={{
              background: '#090d16',
              border: '2px dashed rgba(99, 102, 241, 0.4)',
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
              Pass Code
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '8px 0', fontFamily: 'monospace' }}>
              {userRSVP?.ticketCode || 'TKT-LUCKY'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {event.title} &bull; {formattedDate}
            </div>
          </div>

          <button
            onClick={() => setPassModalOpen(false)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              background: '#6366f1',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            Done
          </button>
        </div>
      </Modal>

      {/* Cancel RSVP Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Your RSVP"
        maxWidth="440px"
      >
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>
          Are you sure you want to cancel your reservation for <strong>{event.title}</strong>?
          Your seat will be released immediately to waitlisted attendees.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setCancelModalOpen(false)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Keep Reservation
          </button>
          <button
            onClick={handleCancelRSVP}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: '#f43f5e',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Yes, Cancel RSVP
          </button>
        </div>
      </Modal>

      {/* Delete Event Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Event"
        maxWidth="440px"
      >
        <p style={{ color: '#94a3b8', marginBottom: 24 }}>
          This action cannot be undone. Deleting this event will also permanently delete all attendee RSVPs.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setDeleteModalOpen(false)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteEvent}
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

      {/* Attendee Roster Modal */}
      <Modal
        isOpen={rosterModalOpen}
        onClose={() => setRosterModalOpen(false)}
        title={`Confirmed Attendee Roster (${attendeeRoster.length})`}
        maxWidth="600px"
      >
        {rosterLoading ? (
          <LoadingSpinner label="Loading attendees..." />
        ) : attendeeRoster.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>
            No confirmed RSVPs yet for this event.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
            {attendeeRoster.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={r.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${i}`}
                    alt={r.user?.name}
                    style={{ width: 36, height: 36, borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>{r.user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{r.user?.email}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: r.status === 'attending' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: r.status === 'attending' ? '#10b981' : '#f59e0b',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {r.status.toUpperCase()} ({r.guestCount})
                  </span>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6366f1', marginTop: 4 }}>
                    {r.ticketCode}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </Container>
  );
};
