import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Save } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

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

export const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    startDate: '',
    time: '',
    isVirtual: false,
    location: '',
    virtualMeetingUrl: '',
    capacity: 100,
    ticketType: 'Free',
    price: 0,
    bannerImage: '',
    tags: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.events.getById(id);
        if (res.success && res.event) {
          const e = res.event;
          // Format date for datetime-local input
          const formattedDate = new Date(e.startDate).toISOString().slice(0, 16);
          setFormData({
            title: e.title,
            description: e.description,
            category: e.category,
            startDate: formattedDate,
            time: e.time || '',
            isVirtual: Boolean(e.isVirtual),
            location: e.location,
            virtualMeetingUrl: e.virtualMeetingUrl || '',
            capacity: e.capacity,
            ticketType: e.ticketType || 'Free',
            price: e.price || 0,
            bannerImage: e.bannerImage,
            tags: Array.isArray(e.tags) ? e.tags.join(', ') : '',
          });
        }
      } catch (err) {
        showToast(err.message || 'Failed to fetch event', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity) || 100,
        price: formData.ticketType === 'Paid' ? Number(formData.price) || 0 : 0,
      };

      const res = await api.events.update(id, payload);
      if (res.success) {
        showToast('Event updated successfully!', 'success');
        navigate(`/events/${id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading event data..." padding="120px 20px" />;
  }

  return (
    <Container>
      <BackLink to={`/events/${id}`}>
        <ChevronLeft size={18} /> Back to Event
      </BackLink>

      <FormCard>
        <Header>
          <h1>Edit Event</h1>
          <p>Update schedules, capacity, descriptions, and venue information</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
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
                value={formData.time}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>Attendee Capacity *</label>
              <input
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <label>Location / Venue *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Virtual Meeting Link</label>
              <input
                type="url"
                name="virtualMeetingUrl"
                value={formData.virtualMeetingUrl}
                onChange={handleChange}
              />
            </FormGroup>
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
              value={formData.bannerImage}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Detailed Description *</label>
            <textarea
              name="description"
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
              value={formData.tags}
              onChange={handleChange}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Saving Changes...' : 'Save & Update Event'}
            <Save size={18} />
          </SubmitButton>
        </Form>
      </FormCard>
    </Container>
  );
};
