import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PageWrapper = styled.div`
  min-height: calc(100vh - 150px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 40px;
  box-shadow: ${({ theme }) => theme.shadows.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 28px 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
  }
`;

const QuickLogins = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(99, 102, 241, 0.08);
  border: 1px dashed rgba(99, 102, 241, 0.3);

  .label {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #a5b4fc;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .btn-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button {
    flex: 1;
    min-width: 110px;
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(255, 255, 255, 0.07);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.88rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  input {
    width: 100%;
    padding: 13px 16px 13px 44px;
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

  .toggle-btn {
    position: absolute;
    right: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    padding: 4px;

    &:hover {
      color: #fff;
    }
  }
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
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

const FooterText = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result?.success) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <PageWrapper>
      <AuthCard>
        <Header>
          <h1>Welcome Back</h1>
          <p>Sign in to orchestrate your events or view RSVP passes</p>
        </Header>

        <QuickLogins>
          <div className="label">
            <Sparkles size={14} /> 1-Click Demo Accounts:
          </div>
          <div className="btn-group">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@luckyevents.com', 'password123')}
            >
              Admin (Eleanor)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sarah@luckyevents.com', 'password123')}
            >
              Organizer (Sarah)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('alex@luckyevents.com', 'password123')}
            >
              Attendee (Alex)
            </button>
          </div>
        </QuickLogins>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Email Address</label>
            <InputWrapper>
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Password</label>
            <InputWrapper>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </InputWrapper>
          </FormGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={18} />
          </SubmitButton>
        </Form>

        <FooterText>
          Don't have an account yet? <Link to="/signup">Create one for free</Link>
        </FooterText>
      </AuthCard>
    </PageWrapper>
  );
};
