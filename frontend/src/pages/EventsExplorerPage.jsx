import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Calendar, X } from 'lucide-react';
import { api } from '../api/client';
import { EventCard } from '../components/EventCard';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const PageHeader = styled.div`
  margin-bottom: 36px;
  text-align: center;

  h1 {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 12px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const SearchFilterBar = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 16px 20px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SearchRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: #fff;
    font-size: 0.95rem;
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
    }
  }

  .clear-btn {
    position: absolute;
    right: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    padding: 4px;
    &:hover {
      color: #fff;
    }
  }
`;

const FilterControls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  select {
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radii.md};
    background: #0f172a;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.9rem;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const CategoriesPills = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const Pill = styled.button`
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transitions.fast};

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.colors.textSecondary};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryHover : 'rgba(255, 255, 255, 0.1)'};
    color: #ffffff;
  }
`;

const ResultsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 0.92rem;
  color: ${({ theme }) => theme.colors.textSecondary};
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

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  max-width: 600px;
  margin: 40px auto;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 20px;
  }

  button {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    padding: 10px 24px;
    border-radius: ${({ theme }) => theme.radii.full};
    font-weight: 600;
  }
`;

const categories = [
  'All',
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Networking',
  'Health & Wellness',
];

export const EventsExplorerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const ticketType = searchParams.get('ticketType') || 'All';
  const sort = searchParams.get('sort') || 'upcoming';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 9,
          search,
          category,
          ticketType,
          sort,
        };
        const res = await api.events.getAll(params);
        if (res.success) {
          setEvents(res.data);
          setTotalPages(res.totalPages);
          setTotalEvents(res.totalEvents);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, search, category, ticketType, sort]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === '') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    nextParams.set('page', '1'); // Reset to first page
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateParam('search', '');
  };

  return (
    <Container>
      <PageHeader>
        <h1>Explore Upcoming Events</h1>
        <p>
          Discover cutting-edge developer summits, founder mixers, and executive workshops.
        </p>
      </PageHeader>

      <SearchFilterBar>
        <SearchRow>
          <SearchInputWrapper as="form" onSubmit={handleSearchSubmit}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by title, keywords, or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </SearchInputWrapper>

          <FilterControls>
            <select
              value={ticketType}
              onChange={(e) => updateParam('ticketType', e.target.value)}
              aria-label="Ticket Type Filter"
            >
              <option value="All">All Tickets</option>
              <option value="Free">Free Only</option>
              <option value="Paid">Paid Only</option>
            </select>

            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              aria-label="Sort Orders"
            >
              <option value="upcoming">Sort by Date</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Added</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </FilterControls>
        </SearchRow>

        <CategoriesPills>
          {categories.map((cat) => (
            <Pill
              key={cat}
              $active={category === cat}
              onClick={() => updateParam('category', cat)}
            >
              {cat}
            </Pill>
          ))}
        </CategoriesPills>
      </SearchFilterBar>

      <ResultsMeta>
        <span>
          Showing <strong>{events.length}</strong> of <strong>{totalEvents}</strong> events
        </span>
        {category !== 'All' && <span>Filtered by: <strong>{category}</strong></span>}
      </ResultsMeta>

      {loading ? (
        <LoadingSpinner label="Discovering events..." padding="80px 20px" />
      ) : events.length === 0 ? (
        <EmptyState>
          <h3>No events found</h3>
          <p>We couldn't find any events matching your current filters.</p>
          <button
            onClick={() => {
              setSearchParams({});
              setSearchInput('');
            }}
          >
            Reset Filters
          </button>
        </EmptyState>
      ) : (
        <>
          <EventsGrid>
            {events.map((evt) => (
              <EventCard key={evt._id || evt.id} event={evt} />
            ))}
          </EventsGrid>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              const next = new URLSearchParams(searchParams);
              next.set('page', newPage.toString());
              setSearchParams(next);
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </Container>
  );
};
