import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
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
  max-width: 500px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
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

const RoleSelectGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 4px;

  button {
    padding: 12px;
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: 0.88rem;
    font-weight: 600;
    border: 1px solid
      ${({ $selected, theme }) =>
        $selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.primaryLight : 'rgba(255, 255, 255, 0.03)'};
    color: ${({ $selected, theme }) =>
      $selected ? theme.colors.white : theme.colors.textSecondary};
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
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

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setSubmitting(true);
    const result = await register({
      name,
      email,
      password,
      organization,
      role,
    });
    setSubmitting(false);

    if (result?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <Header>
          <h1>Create Your Account</h1>
          <p>Get instant access to live summits, ticket passes, &amp; hosting tools</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Full Name</label>
            <InputWrapper>
              <User size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Work Email</label>
            <InputWrapper>
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Organization / Company (Optional)</label>
            <InputWrapper>
              <Building size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Acme Innovations"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <label>Password</label>
            <InputWrapper>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            {submitting ? 'Creating Account...' : 'Get Started'}
            <ArrowRight size={18} />
          </SubmitButton>
        </Form>

        <FooterText>
          Already have an account? <Link to="/login">Sign in here</Link>
        </FooterText>
      </AuthCard>
    </PageWrapper>
  );
};
