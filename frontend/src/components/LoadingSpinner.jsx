import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ $padding }) => $padding || '48px 24px'};
  gap: 16px;
`;

const Circle = styled.div`
  width: ${({ $size }) => $size || '40px'};
  height: ${({ $size }) => $size || '40px'};
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Label = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  font-weight: 500;
`;

export const LoadingSpinner = ({ size, label, padding }) => (
  <SpinnerWrapper $padding={padding}>
    <Circle $size={size} />
    {label && <Label>{label}</Label>}
  </SpinnerWrapper>
);
