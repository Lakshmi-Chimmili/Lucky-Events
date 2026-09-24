import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.bgSecondary};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid
    ${({ $type, theme }) =>
      $type === 'error'
        ? theme.colors.rose
        : $type === 'info'
        ? theme.colors.accent
        : theme.colors.emerald};
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(12px);
  max-width: 420px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $type, theme }) =>
    $type === 'error'
      ? theme.colors.rose
      : $type === 'info'
      ? theme.colors.accent
      : theme.colors.emerald};
`;

const Message = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.4;
  flex: 1;
`;

const CloseButton = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const Toast = () => {
  const { toast, hideToast } = useAuth();

  if (!toast.show) return null;

  return (
    <ToastContainer $type={toast.type}>
      <IconWrapper $type={toast.type}>
        {toast.type === 'error' && <AlertCircle size={20} />}
        {toast.type === 'info' && <Info size={20} />}
        {toast.type === 'success' && <CheckCircle2 size={20} />}
      </IconWrapper>
      <Message>{toast.message}</Message>
      <CloseButton onClick={hideToast}>
        <X size={16} />
      </CloseButton>
    </ToastContainer>
  );
};
