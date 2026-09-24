import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Sparkles, Send, Globe, MessageCircle, Share2, Check } from 'lucide-react';

const FooterWrapper = styled.footer`
  background: #060911;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 80px 24px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent);
  }
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 60px;

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const BrandCol = styled.div`
  .desc {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
    margin: 16px 0 24px;
    max-width: 320px;
    line-height: 1.6;
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};

  span {
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ColTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 20px;
  letter-spacing: 0.5px;
`;

const LinkList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.92rem;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      transform: translateX(4px);
      display: inline-block;
    }
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  position: relative;
  margin-top: 14px;

  input {
    width: 100%;
    padding: 12px 16px;
    padding-right: 50px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 0.9rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
    }
  }

  button {
    position: absolute;
    right: 6px;
    top: 6px;
    bottom: 6px;
    width: 38px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  }
`;

const BottomBar = styled.div`
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;

  p {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  .socials {
    display: flex;
    gap: 16px;

    a {
      color: ${({ theme }) => theme.colors.textMuted};
      transition: ${({ theme }) => theme.transitions.fast};

      &:hover {
        color: ${({ theme }) => theme.colors.white};
      }
    }
  }
`;

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <FooterWrapper>
      <Container>
        <TopGrid>
          <BrandCol>
            <Logo to="/">
              <Sparkles size={18} color="#6366f1" />
              Lucky<span>Events</span>
            </Logo>
            <p className="desc">
              The modern SaaS platform engineered for unforgettable summits,
              curated workshops, and community experiences with automated RSVPs
              and attendee management.
            </p>
          </BrandCol>

          <div>
            <ColTitle>Explore</ColTitle>
            <LinkList>
              <li><Link to="/events">Browse Events</Link></li>
              <li><Link to="/events?category=Technology">Tech Summits</Link></li>
              <li><Link to="/events?category=Business">Executive Masterclasses</Link></li>
              <li><Link to="/events?category=Design">Design Jams</Link></li>
              <li><Link to="/create-event">Host an Event</Link></li>
            </LinkList>
          </div>

          <div>
            <ColTitle>Platform</ColTitle>
            <LinkList>
              <li><a href="#features">Smart Reminders</a></li>
              <li><a href="#features">Capacity Engine</a></li>
              <li><a href="#pricing">Pricing Plans</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
              <li><Link to="/dashboard">Creator Dashboard</Link></li>
            </LinkList>
          </div>

          <div>
            <ColTitle>Stay Updated</ColTitle>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 12 }}>
              Get weekly highlights on the biggest conferences, workshops, and exclusive invites.
            </p>
            <NewsletterForm onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                {subscribed ? <Check size={18} /> : <Send size={16} />}
              </button>
            </NewsletterForm>
            {subscribed && (
              <p style={{ color: '#10b981', fontSize: '0.82rem', marginTop: 8 }}>
                ✓ Subscribed! You're on the insider list.
              </p>
            )}
          </div>
        </TopGrid>

        <BottomBar>
          <p>&copy; {new Date().getFullYear()} LuckyEvents Inc. All rights reserved.</p>
          <div className="socials">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Website">
              <Globe size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Community">
              <MessageCircle size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Share">
              <Share2 size={18} />
            </a>
          </div>
        </BottomBar>
      </Container>
    </FooterWrapper>
  );
};
