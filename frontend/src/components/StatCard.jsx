import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const IconBox = styled.div`
  width: 52px;
  height: 52px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color }) => $color ? `${$color}20` : 'rgba(99, 102, 241, 0.15)'};
  color: ${({ $color, theme }) => $color || theme.colors.primary};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Value = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.85rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.1;
`;

const Label = styled.div`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
  font-weight: 500;
`;

export const StatCard = ({ icon, value, label, color }) => (
  <Card>
    <IconBox $color={color}>{icon}</IconBox>
    <Content>
      <Value>{value}</Value>
      <Label>{label}</Label>
    </Content>
  </Card>
);
