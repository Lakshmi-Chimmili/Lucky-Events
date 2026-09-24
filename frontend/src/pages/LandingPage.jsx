import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  CheckCircle,
  Bell,
  Users,
  ShieldCheck,
  ArrowRight,
  Zap,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Star,
  Layers,
} from 'lucide-react';
import { api } from '../api/client';
import { EventCard } from '../components/EventCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
`;

const HeroSection = styled.section`
  position: relative;
  padding: 100px 24px 80px;
  max-width: 1240px;
  margin: 0 auto;
  text-align: center;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 60px 20px 40px;
  }
`;

const EyebrowBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #a5b4fc;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 28px;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  line-height: 1.12;
  margin-bottom: 24px;

  span.gradient {
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.6rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 720px;
  margin: 0 auto 36px;
  line-height: 1.6;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.05rem;
  }
`;

const HeroCTA = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 56px;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff !important;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 16px 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.7);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: ${({ theme }) => theme.colors.white} !important;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 16px 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const HeroStatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 820px;
  margin: 0 auto;
  padding: 24px;
  background: rgba(19, 27, 44, 0.6);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  backdrop-filter: blur(12px);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .number {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.white};
  }

  .label {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 4px;
  }
`;

// Section Styling
const Section = styled.section`
  padding: 90px 24px;
  max-width: 1240px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;

  h2 {
    font-size: 2.6rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 16px;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const BentoCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 36px 30px;
  position: relative;
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.normal};
  grid-column: ${({ $span }) => ($span ? `span ${$span}` : 'span 1')};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-column: span 1;
  }

  .icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $color }) => ($color ? `${$color}20` : 'rgba(99, 102, 241, 0.15)')};
    color: ${({ $color, theme }) => $color || theme.colors.primary};
    margin-bottom: 22px;
  }

  h3 {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

// Pricing Components
const PricingToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 48px;

  button {
    padding: 8px 18px;
    border-radius: ${({ theme }) => theme.radii.full};
    font-weight: 600;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    background: transparent;
    transition: ${({ theme }) => theme.transitions.fast};

    &.active {
      background: ${({ theme }) => theme.colors.primary};
      color: #fff;
    }
  }

  .discount {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 99px;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
`;

const PricingCard = styled.div`
  background: ${({ $highlight, theme }) =>
    $highlight
      ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(19, 27, 44, 0.9) 100%)'
      : theme.colors.bgCard};
  border: 1px solid
    ${({ $highlight, theme }) =>
      $highlight ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 40px 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $highlight, theme }) =>
    $highlight ? theme.shadows.glow : theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-5px);
  }

  .popular-tag {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #6366f1, #ec4899);
    color: #fff;
    padding: 4px 16px;
    border-radius: 99px;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .plan-name {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .plan-desc {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .price-box {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 28px;

    .price {
      font-size: 2.8rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.white};
      font-family: ${({ theme }) => theme.fonts.heading};
    }

    .period {
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: 0.9rem;
    }
  }

  .features-list {
    margin-bottom: 36px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.92rem;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  .plan-btn {
    margin-top: auto;
    width: 100%;
    padding: 14px;
    border-radius: ${({ theme }) => theme.radii.lg};
    font-weight: 700;
    font-size: 0.95rem;
    text-align: center;
    display: block;
    background: ${({ $highlight, theme }) =>
      $highlight ? theme.colors.primary : 'rgba(255, 255, 255, 0.08)'};
    color: #ffffff !important;
    border: 1px solid
      ${({ $highlight }) => ($highlight ? 'transparent' : 'rgba(255, 255, 255, 0.15)')};
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ $highlight, theme }) =>
        $highlight ? theme.colors.primaryHover : 'rgba(255, 255, 255, 0.15)'};
    }
  }
`;

// Testimonials
const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 32px;
  display: flex;
  flex-direction: column;

  .stars {
    display: flex;
    gap: 4px;
    color: #f59e0b;
    margin-bottom: 16px;
  }

  .quote {
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.96rem;
    line-height: 1.6;
    margin-bottom: 24px;
    flex: 1;
    font-style: italic;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }

    .name {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.white};
      font-size: 0.95rem;
    }

    .role {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

// FAQ Accordion
const FAQList = styled.div`
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 1.05rem;

  svg {
    transition: transform 0.25s ease;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FAQAnswer = styled.div`
  padding: 0 24px 22px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.6;
  display: ${({ $open }) => ($open ? 'block' : 'none')};
`;

// CTA Section
const CTABox = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.35);
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 70px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.glow};

  h2 {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 16px;

    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      font-size: 2.1rem;
    }
  }

  p {
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    max-width: 600px;
    margin: 0 auto 36px;
  }
`;

export const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annualBilling, setAnnualBilling] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.events.getFeatured();
        if (res.success) {
          setFeaturedEvents(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching featured events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqItems = [
    {
      q: 'How does the automated RSVP and capacity engine work?',
      a: 'When an attendee RSVPs, our system instantly checks real-time seat availability. If seats are open, they receive an official Ticket Pass with a unique code. If the event capacity is reached, they are placed on the smart waitlist.',
    },
    {
      q: 'Are automated email reminders sent to attendees?',
      a: 'Yes! LuckyEvents has an integrated background cron scheduler that dispatches automated email reminders 24 hours prior to every event. Organizers can also trigger instant reminder broadcasts directly from their dashboard.',
    },
    {
      q: 'Can I host both virtual and in-person events?',
      a: 'Absolutely. LuckyEvents natively supports in-person venues with Google Maps pin navigation, as well as virtual streams with secure Zoom/Google Meet links revealed exclusively to confirmed attendees.',
    },
    {
      q: 'Is there a limit on how many events I can organize?',
      a: 'Free community organizers can host up to 3 active events concurrently. On Pro and Enterprise tiers, you can publish unlimited events with custom branding, advanced analytics, and priority email delivery.',
    },
  ];

  return (
    <>
      <HeroSection>
        <EyebrowBadge>
          <Sparkles size={16} />
          The Next-Generation Event &amp; RSVP Engine
        </EyebrowBadge>

        <HeroTitle>
          Orchestrate Unforgettable Events with <span className="gradient">SaaS Precision</span>
        </HeroTitle>

        <HeroSubtitle>
          From high-energy developer summits to intimate executive roundtables.
          Manage registrations, dynamic capacity limits, automated reminders, and digital ticket passes with ease.
        </HeroSubtitle>

        <HeroCTA>
          <PrimaryButton to="/events">
            Explore Live Events
            <ArrowRight size={18} />
          </PrimaryButton>
          <SecondaryButton to="/create-event">
            + Host Your Event
          </SecondaryButton>
        </HeroCTA>

        <HeroStatsBar>
          <StatItem>
            <div className="number">150,000+</div>
            <div className="label">Confirmed RSVPs</div>
          </StatItem>
          <StatItem>
            <div className="number">99.8%</div>
            <div className="label">Notification Delivery</div>
          </StatItem>
          <StatItem>
            <div className="number">4.9 / 5.0</div>
            <div className="label">Organizer Satisfaction</div>
          </StatItem>
        </HeroStatsBar>
      </HeroSection>

      {/* Featured Events Section */}
      <Section id="events-preview">
        <SectionHeader>
          <h2>Featured Upcoming Summits</h2>
          <p>Hand-picked conferences, workshops, and mixers happening this month.</p>
        </SectionHeader>

        {loading ? (
          <LoadingSpinner label="Loading featured events..." />
        ) : (
          <EventsGrid>
            {featuredEvents.map((evt) => (
              <EventCard key={evt._id || evt.id} event={evt} />
            ))}
          </EventsGrid>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <SecondaryButton to="/events">
            View All Events &amp; Conferences
            <ArrowRight size={16} />
          </SecondaryButton>
        </div>
      </Section>

      {/* Feature Bento Grid */}
      <Section id="features">
        <SectionHeader>
          <h2>Engineered for Modern Organizers</h2>
          <p>Everything you need to fill your seats and deliver flawless attendee journeys.</p>
        </SectionHeader>

        <BentoGrid>
          <BentoCard $color="#6366f1">
            <div className="icon"><Zap size={24} /></div>
            <h3>1-Click Smart RSVP</h3>
            <p>
              Attendees secure digital passes instantly with frictionless RSVP forms,
              unique ticket barcodes, and immediate email confirmations.
            </p>
          </BentoCard>

          <BentoCard $color="#ec4899">
            <div className="icon"><Bell size={24} /></div>
            <h3>Automated Email Reminders</h3>
            <p>
              Integrated background scheduling keeps no-show rates near zero with
              rich HTML reminders, calendar sync links, and venue directions.
            </p>
          </BentoCard>

          <BentoCard $color="#06b6d4">
            <div className="icon"><Users size={24} /></div>
            <h3>Dynamic Capacity &amp; Waitlists</h3>
            <p>
              Set maximum venue capacity. If a summit sells out, interested attendees
              are automatically placed in a prioritized queue.
            </p>
          </BentoCard>

          <BentoCard $span={2} $color="#10b981">
            <div className="icon"><Layers size={24} /></div>
            <h3>Organizer Command Dashboard</h3>
            <p>
              Manage your entire portfolio from a single modern cockpit. Edit schedules,
              manage rosters, monitor registration velocity, and broadcast manual reminders with one click.
            </p>
          </BentoCard>

          <BentoCard $color="#f59e0b">
            <div className="icon"><ShieldCheck size={24} /></div>
            <h3>Enterprise Role Security</h3>
            <p>
              Role-based access control (RBAC), bcrypt-hashed passwords, and JWT session tokens ensure your event data is strictly protected.
            </p>
          </BentoCard>
        </BentoGrid>
      </Section>

      {/* Pricing Section */}
      <Section id="pricing">
        <SectionHeader>
          <h2>Transparent SaaS Pricing</h2>
          <p>Scale effortlessly from free community gatherings to global multiday conferences.</p>
        </SectionHeader>

        <PricingToggle>
          <button
            className={!annualBilling ? 'active' : ''}
            onClick={() => setAnnualBilling(false)}
          >
            Monthly
          </button>
          <button
            className={annualBilling ? 'active' : ''}
            onClick={() => setAnnualBilling(true)}
          >
            Annual
            <span className="discount">SAVE 20%</span>
          </button>
        </PricingToggle>

        <PricingGrid>
          {/* Starter Plan */}
          <PricingCard>
            <div className="plan-name">Starter Community</div>
            <div className="plan-desc">For meetup organizers and community founders.</div>
            <div className="price-box">
              <span className="price">$0</span>
              <span className="period">/ month forever</span>
            </div>
            <ul className="features-list">
              <li><CheckCircle size={18} color="#10b981" /> Up to 3 Active Events</li>
              <li><CheckCircle size={18} color="#10b981" /> 100 RSVPs per Event</li>
              <li><CheckCircle size={18} color="#10b981" /> Automated 24h Reminders</li>
              <li><CheckCircle size={18} color="#10b981" /> Digital Ticket Codes</li>
            </ul>
            <Link to="/signup" className="plan-btn">Start Free</Link>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard $highlight={true}>
            <div className="popular-tag">Most Popular</div>
            <div className="plan-name">Pro Event Producer</div>
            <div className="plan-desc">For growing conferences, workshops, and creators.</div>
            <div className="price-box">
              <span className="price">${annualBilling ? '29' : '39'}</span>
              <span className="period">/ month</span>
            </div>
            <ul className="features-list">
              <li><CheckCircle size={18} color="#6366f1" /> Unlimited Active Events</li>
              <li><CheckCircle size={18} color="#6366f1" /> Unlimited Attendees</li>
              <li><CheckCircle size={18} color="#6366f1" /> Instant Broadcast Reminders</li>
              <li><CheckCircle size={18} color="#6366f1" /> Waitlist Management</li>
              <li><CheckCircle size={18} color="#6366f1" /> Attendee CSV Exports</li>
            </ul>
            <Link to="/signup" className="plan-btn">Get Pro Access</Link>
          </PricingCard>

          {/* Enterprise Plan */}
          <PricingCard>
            <div className="plan-name">Enterprise Scaled</div>
            <div className="plan-desc">For summit corporations, universities, and festivals.</div>
            <div className="price-box">
              <span className="price">${annualBilling ? '99' : '129'}</span>
              <span className="period">/ month</span>
            </div>
            <ul className="features-list">
              <li><CheckCircle size={18} color="#10b981" /> Dedicated Account Manager</li>
              <li><CheckCircle size={18} color="#10b981" /> Custom Domain &amp; White-label</li>
              <li><CheckCircle size={18} color="#10b981" /> Custom SMTP Email Relay</li>
              <li><CheckCircle size={18} color="#10b981" /> Priority 24/7 SLA Support</li>
              <li><CheckCircle size={18} color="#10b981" /> Enterprise Role Permissions</li>
            </ul>
            <Link to="/signup" className="plan-btn">Contact Sales</Link>
          </PricingCard>
        </PricingGrid>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <SectionHeader>
          <h2>Loved by Event Creators</h2>
          <p>See why founders and organizers trust LuckyEvents for their premier summits.</p>
        </SectionHeader>

        <TestimonialGrid>
          <TestimonialCard>
            <div className="stars">
              {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill="#f59e0b" />))}
            </div>
            <p className="quote">
              "LuckyEvents slashed our attendee no-show rate by over 60%. The automatic email reminder scheduler and sleek digital passes are game changers for our tech conference."
            </p>
            <div className="author">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Elena Vance" />
              <div>
                <div className="name">Elena Vance</div>
                <div className="role">Head of Community, CloudNova</div>
              </div>
            </div>
          </TestimonialCard>

          <TestimonialCard>
            <div className="stars">
              {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill="#f59e0b" />))}
            </div>
            <p className="quote">
              "The capacity and waitlist management is instantaneous. When our 300-person AI workshop filled up in 4 hours, the automated queue kept everyone informed without any manual hassle."
            </p>
            <div className="author">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Marcus Chen" />
              <div>
                <div className="name">Marcus Chen</div>
                <div className="role">Founder, San Francisco AI Lab</div>
              </div>
            </div>
          </TestimonialCard>

          <TestimonialCard>
            <div className="stars">
              {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill="#f59e0b" />))}
            </div>
            <p className="quote">
              "The design aesthetics are sublime. Our attendees constantly praise how polished the event pages look on their phones. It truly gives our brand a high-end feel."
            </p>
            <div className="author">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" alt="Sarah Jenkins" />
              <div>
                <div className="name">Sarah Jenkins</div>
                <div className="role">Producer, DesignJam Europe</div>
              </div>
            </div>
          </TestimonialCard>
        </TestimonialGrid>
      </Section>

      {/* FAQ Section */}
      <Section id="faq">
        <SectionHeader>
          <h2>Frequently Asked Questions</h2>
          <p>Got questions about hosting or attending events? We've got answers.</p>
        </SectionHeader>

        <FAQList>
          {faqItems.map((item, idx) => (
            <FAQItem key={idx}>
              <FAQQuestion
                $open={openFAQ === idx}
                onClick={() => toggleFAQ(idx)}
              >
                <span>{item.q}</span>
                <ChevronDown size={20} />
              </FAQQuestion>
              <FAQAnswer $open={openFAQ === idx}>
                {item.a}
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>
      </Section>

      {/* Bottom CTA Banner */}
      <Section style={{ paddingTop: 20 }}>
        <CTABox>
          <h2>Ready to Host Your Next Big Event?</h2>
          <p>
            Join over 10,000+ creators who host breathtaking summits, webinars, and meetups with LuckyEvents.
          </p>
          <PrimaryButton to="/signup" style={{ padding: '16px 42px' }}>
            Get Started Free in 60 Seconds
            <ArrowRight size={18} />
          </PrimaryButton>
        </CTABox>
      </Section>
    </>
  );
};
