import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
`;

const PageBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.fast};

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.textSecondary};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryHover : 'rgba(255, 255, 255, 0.1)'};
    color: ${({ theme }) => theme.colors.white};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <PaginationWrapper>
      <PageBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} />
      </PageBtn>

      {pages.map((p) => (
        <PageBtn
          key={p}
          $active={p === currentPage}
          onClick={() => onPageChange(p)}
        >
          {p}
        </PageBtn>
      ))}

      <PageBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next Page"
      >
        <ChevronRight size={18} />
      </PageBtn>
    </PaginationWrapper>
  );
};
