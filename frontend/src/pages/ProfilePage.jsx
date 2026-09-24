import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Mail, Building, FileText, Lock, Save, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const ProfileHero = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 36px;
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${({ theme }) => theme.colors.primary};
  }

  .info {
    flex: 1;

    .name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;

      h1 {
        font-size: 1.8rem;
        font-weight: 800;
      }

      .role-badge {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 99px;
        background: rgba(99, 102, 241, 0.15);
        color: #a5b4fc;
        border: 1px solid rgba(99, 102, 241, 0.3);
      }
    }

    .email {
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: 0.95rem;
    }
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 36px;
  margin-bottom: 32px;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  h2 {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
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

  input, textarea {
    padding: 12px 16px;
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
    }
  }

  textarea {
    min-height: 80px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ProfilePage = () => {
  const { user, updateUser, showToast } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await api.user.updateProfile(profileData);
      if (res.success) {
        updateUser(res.user);
        showToast('Profile information updated!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.user.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        showToast('Password changed successfully!', 'success');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <Container>
      <ProfileHero>
        <img
          src={
            user?.avatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              user?.name || 'User'
            )}`
          }
          alt={user?.name}
        />
        <div className="info">
          <div className="name-row">
            <h1>{user?.name}</h1>
            <span className="role-badge">{user?.role}</span>
          </div>
          <div className="email">{user?.email}</div>
          {user?.organization && (
            <div style={{ color: '#6366f1', fontSize: '0.88rem', fontWeight: 600, marginTop: 4 }}>
              {user.organization}
            </div>
          )}
        </div>
      </ProfileHero>

      {/* Profile Details Card */}
      <Card>
        <h2>
          <User size={20} color="#6366f1" />
          Personal &amp; Organization Details
        </h2>

        <Form onSubmit={handleProfileSubmit}>
          <FormGroup>
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Organization / Title</label>
            <input
              type="text"
              placeholder="e.g. Design Lead at Acme Inc."
              value={profileData.organization}
              onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Bio (Short summary for your attendee/organizer profile)</label>
            <textarea
              placeholder="Tell others about your focus, topics, or background..."
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>Custom Avatar Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={updatingProfile}>
            <Save size={16} />
            {updatingProfile ? 'Saving...' : 'Save Profile'}
          </SubmitButton>
        </Form>
      </Card>

      {/* Password Security Card */}
      <Card>
        <h2>
          <Lock size={20} color="#ec4899" />
          Account Security &amp; Password
        </h2>

        <Form onSubmit={handlePasswordSubmit}>
          <FormGroup>
            <label>Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>New Password (min 6 characters)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </FormGroup>

          <FormGroup>
            <label>Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={updatingPassword}>
            <ShieldCheck size={16} />
            {updatingPassword ? 'Updating...' : 'Update Password'}
          </SubmitButton>
        </Form>
      </Card>
    </Container>
  );
};
