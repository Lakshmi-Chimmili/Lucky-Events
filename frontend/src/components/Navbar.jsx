import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  PlusCircle,
  User,
  Ticket,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background: ${({ $scrolled, theme }) =>
    $scrolled ? 'rgba(9, 13, 22, 0.85)' : 'rgba(9, 13, 22, 0.5)'};
  backdrop-filter: blur(16px);
  border-bottom: 1px solid
    ${({ $scrolled, theme }) =>
      $scrolled ? theme.colors.borderLight : 'rgba(255, 255, 255, 0.05)'};
  transition: ${({ theme }) => theme.transitions.normal};
`;

const NavContainer = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.45rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  letter-spacing: -0.5px;

  span {
    background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textSecondary};
  font-size: 0.95rem;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }

  ${({ $active, theme }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.primary};
      border-radius: 2px;
    }
  `}
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const CreateBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff !important;
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
  }
`;

const LoginBtn = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background: rgba(255, 255, 255, 0.06);
  }
`;

const SignupBtn = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white} !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.9rem;
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserAvatarBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 6px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 230px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: 8px;
  z-index: 100;
  animation: fadeIn 0.2s ease-out;
`;

const UserInfoBlock = styled.div`
  padding: 12px 14px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 6px;

  .name {
    font-weight: 700;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.white};
  }

  .email {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMuted};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${({ theme }) => theme.colors.white};
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.rose};
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(244, 63, 94, 0.1);
  }
`;

const MobileToggle = styled.button`
  display: none;
  color: ${({ theme }) => theme.colors.white};
  padding: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileDrawer = styled.div`
  display: none;
  padding: 20px 24px 30px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    gap: 16px;
  }
`;

const MobileLink = styled(Link)`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Header $scrolled={scrolled}>
      <NavContainer>
        <LogoLink to="/">
          <LogoIcon>
            <Sparkles size={20} />
          </LogoIcon>
          Lucky<span>Events</span>
        </LogoLink>

        <NavLinks>
          <NavItem to="/events" $active={location.pathname === '/events'}>
            Explore Events
          </NavItem>
          <NavItem to="/#features">Features</NavItem>
          <NavItem to="/#pricing">Pricing</NavItem>
          <NavItem to="/#faq">FAQ</NavItem>
        </NavLinks>

        <ActionsContainer>
          {isAuthenticated ? (
            <>
              <CreateBtn to="/create-event">
                <PlusCircle size={18} />
                Create Event
              </CreateBtn>

              <UserMenuWrapper ref={dropdownRef}>
                <UserAvatarBtn onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.name
                      )}`
                    }
                    alt={user.name}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </UserAvatarBtn>

                {dropdownOpen && (
                  <DropdownMenu>
                    <UserInfoBlock>
                      <div className="name">{user.name}</div>
                      <div className="email">{user.email}</div>
                    </UserInfoBlock>

                    <DropdownItem to="/dashboard">
                      <LayoutDashboard size={16} />
                      Dashboard
                    </DropdownItem>
                    <DropdownItem to="/dashboard?tab=rsvps">
                      <Ticket size={16} />
                      My RSVPs
                    </DropdownItem>
                    <DropdownItem to="/profile">
                      <User size={16} />
                      Profile Settings
                    </DropdownItem>

                    <div
                      style={{
                        height: 1,
                        background: 'rgba(255,255,255,0.08)',
                        margin: '6px 0',
                      }}
                    />

                    <DropdownButton onClick={handleLogout}>
                      <LogOut size={16} />
                      Log Out
                    </DropdownButton>
                  </DropdownMenu>
                )}
              </UserMenuWrapper>
            </>
          ) : (
            <>
              <LoginBtn to="/login">Sign In</LoginBtn>
              <SignupBtn to="/signup">Get Started Free</SignupBtn>
            </>
          )}
        </ActionsContainer>

        <MobileToggle
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </MobileToggle>
      </NavContainer>

      <MobileDrawer $open={mobileMenuOpen}>
        <MobileLink to="/events">Explore Events</MobileLink>
        <MobileLink to="/#features">Features</MobileLink>
        <MobileLink to="/#pricing">Pricing</MobileLink>
        <MobileLink to="/#faq">FAQ</MobileLink>

        {isAuthenticated ? (
          <>
            <MobileLink to="/create-event" style={{ color: '#6366f1' }}>
              + Create Event
            </MobileLink>
            <MobileLink to="/dashboard">Dashboard</MobileLink>
            <MobileLink to="/dashboard?tab=rsvps">My RSVPs</MobileLink>
            <MobileLink to="/profile">Profile Settings</MobileLink>
            <MobileLink
              as="button"
              onClick={handleLogout}
              style={{ color: '#f43f5e', textAlign: 'left' }}
            >
              Log Out
            </MobileLink>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
            <Link
              to="/login"
              style={{
                textAlign: 'center',
                padding: '12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                fontWeight: 600,
              }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{
                textAlign: 'center',
                padding: '12px',
                borderRadius: 8,
                background: '#6366f1',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Get Started Free
            </Link>
          </div>
        )}
      </MobileDrawer>
    </Header>
  );
};
