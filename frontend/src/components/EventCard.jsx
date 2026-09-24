import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Video } from 'lucide-react';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.normal};
  position: relative;

  &:hover {
    transform: translateY(-6px);
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.xl}, ${({ theme }) => theme.shadows.glow};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #111827;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PriceBadge = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  background: ${({ $isFree, theme }) =>
    $isFree
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'};
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
`;

const CardBody = styled.div`
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.35;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.4rem;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  margin-bottom: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CapacityContainer = styled.div`
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CapacityInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 6px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ $isFull, theme }) =>
    $isFull
      ? theme.colors.rose
      : 'linear-gradient(90deg, #6366f1, #06b6d4)'};
  width: ${({ $percentage }) => Math.min(100, $percentage)}%;
  transition: width 0.4s ease;
`;

const CardFooter = styled.div`
  padding: 16px 22px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.4);
`;

const Organizer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid rgba(99, 102, 241, 0.3);
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
  }
`;

export const EventCard = ({ event }) => {
  const isFree = event.ticketType === 'Free' || event.price === 0;
  const isSoldOut = event.rsvpCount >= event.capacity;
  const fillPercentage = Math.round(((event.rsvpCount || 0) / (event.capacity || 100)) * 100);

  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card>
      <ImageContainer>
        <img
          src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          loading="lazy"
        />
        <CategoryBadge>{event.category}</CategoryBadge>
        <PriceBadge $isFree={isFree}>
          {isFree ? 'FREE' : `$${event.price}`}
        </PriceBadge>
      </ImageContainer>

      <CardBody>
        <DateRow>
          <Calendar size={15} />
          <span>{formattedDate} {event.time ? `• ${event.time}` : ''}</span>
        </DateRow>

        <Title>{event.title}</Title>

        <LocationRow>
          {event.isVirtual ? <Video size={16} /> : <MapPin size={16} />}
          <span>{event.isVirtual ? 'Virtual Stream' : event.location}</span>
        </LocationRow>

        <CapacityContainer>
          <CapacityInfo>
            <span>
              <Users size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {isSoldOut ? 'Capacity Full' : `${event.capacity - (event.rsvpCount || 0)} seats left`}
            </span>
            <span>{fillPercentage}% full</span>
          </CapacityInfo>
          <ProgressBar>
            <ProgressFill $percentage={fillPercentage} $isFull={isSoldOut} />
          </ProgressBar>
        </CapacityContainer>
      </CardBody>

      <CardFooter>
        <Organizer>
          {event.organizer?.avatar ? (
            <img src={event.organizer.avatar} alt={event.organizer.name} />
          ) : (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#6366f1',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {event.organizer?.name ? event.organizer.name[0] : 'O'}
            </div>
          )}
          <span>{event.organizer?.name || 'Organizer'}</span>
        </Organizer>

        <ViewButton to={`/events/${event._id || event.id}`}>
          View Event
        </ViewButton>
      </CardFooter>
    </Card>
  );
};
