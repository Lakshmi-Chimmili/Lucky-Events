import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  DollarSign,
  Image as ImageIcon,
  Tag,
  ArrowRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 900px;
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
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 40px;
  box-shadow: ${({ theme }) => theme.shadows.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 24px 18px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }

  input, select, textarea {
    padding: 13px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    color: ${({ theme }) => theme.colors.white};
    font-size: 0.95rem;
    outline: none;
    transition: ${({ theme }) => theme.transitions.fast};

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
      background: rgba(255, 255, 255, 0.06);
    }
  }

  select {
    background: #0f172a;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const PresetRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
  overflow-x: auto;
  padding-bottom: 6px;

  button {
    flex-shrink: 0;
    width: 90px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    opacity: 0.7;
    transition: all 0.2s ease;

    &:hover, &.active {
      opacity: 1;
      border-color: ${({ theme }) => theme.colors.primary};
      transform: scale(1.05);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const ToggleContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-size: 0.95rem;
  font-weight: 600;

  input {
    width: 20px;
    height: 20px;
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  margin-top: 16px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 1.05rem;
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

const presetImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
];

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    startDate: '',
    time: '09:00 AM - 05:00 PM',
    isVirtual: false,
    location: '',
    virtualMeetingUrl: '',
    capacity: 100,
    ticketType: 'Free',
    price: 0,
    bannerImage: presetImages[0],
    tags: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate || !formData.location) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity) || 100,
        price: formData.ticketType === 'Paid' ? Number(formData.price) || 0 : 0,
      };

      const res = await api.events.create(payload);
      if (res.success) {
        showToast('Event created successfully!', 'success');
        navigate(`/events/${res.event._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <BackLink to="/dashboard">
        <ChevronLeft size={18} /> Back to Dashboard
      </BackLink>

      <FormCard>
        <Header>
          <h1>Create a New Event</h1>
          <p>Publish your summit, conference, or community session to the world</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Next-Gen Autonomous Systems Summit 2026"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <Row>
            <FormGroup>
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Networking">Networking</option>
                <option value="Health & Wellness">Health &amp; Wellness</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label>Start Date &amp; Time *</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <label>Time Schedule Display</label>
              <input
                type="text"
                name="time"
                placeholder="e.g. 10:00 AM - 04:00 PM EST"
                value={formData.time}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Attendee Capacity Limit *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                placeholder="100"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Row>

          <FormGroup>
            <ToggleContainer>
              <input
                type="checkbox"
                name="isVirtual"
                checked={formData.isVirtual}
                onChange={handleChange}
              />
              <span>This is a Virtual Online Event (Webinar / Stream)</span>
            </ToggleContainer>
          </FormGroup>

          <Row>
            <FormGroup>
              <label>{formData.isVirtual ? 'Virtual Platform Location *' : 'Venue / Location Address *'}</label>
              <input
                type="text"
                name="location"
                placeholder={formData.isVirtual ? 'e.g. Zoom Webinar Room 1' : 'e.g. Moscone Center, San Francisco, CA'}
                value={formData.location}
                onChange={handleChange}
                required
              />
            </FormGroup>

            {formData.isVirtual && (
              <FormGroup>
                <label>Meeting Join URL (Revealed to Attendees)</label>
                <input
                  type="url"
                  name="virtualMeetingUrl"
                  placeholder="https://zoom.us/j/12345678"
                  value={formData.virtualMeetingUrl}
                  onChange={handleChange}
                />
              </FormGroup>
            )}
          </Row>

          <Row>
            <FormGroup>
              <label>Ticket Type</label>
              <select
                name="ticketType"
                value={formData.ticketType}
                onChange={handleChange}
              >
                <option value="Free">Free Ticket</option>
                <option value="Paid">Paid Ticket</option>
              </select>
            </FormGroup>

            {formData.ticketType === 'Paid' && (
              <FormGroup>
                <label>Price ($ USD)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="1"
                  placeholder="149"
                  value={formData.price}
                  onChange={handleChange}
                />
              </FormGroup>
            )}
          </Row>

          <FormGroup>
            <label>Cover Banner Image URL</label>
            <input
              type="url"
              name="bannerImage"
              placeholder="https://images.unsplash.com/..."
              value={formData.bannerImage}
              onChange={handleChange}
            />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Or choose from high-res presets:</span>
            <PresetRow>
              {presetImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={formData.bannerImage === img ? 'active' : ''}
                  onClick={() => setFormData((p) => ({ ...p, bannerImage: img }))}
                >
                  <img src={img} alt={`Preset ${i}`} />
                </button>
              ))}
            </PresetRow>
          </FormGroup>

          <FormGroup>
            <label>Detailed Description &amp; Agenda *</label>
            <textarea
              name="description"
              placeholder="Describe key speakers, topic tracks, interactive workshops, and prerequisites..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Tags (Comma-separated)</label>
            <input
              type="text"
              name="tags"
              placeholder="e.g. AI, Cloud, Python, San Francisco"
              value={formData.tags}
              onChange={handleChange}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Publishing Event...' : 'Publish Event Live'}
            <ArrowRight size={18} />
          </SubmitButton>
        </Form>
      </FormCard>
    </Container>
  );
};
