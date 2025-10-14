import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { PAGE_SIZE } from '../constants/Global';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const P = styled.p`
  font-size: 14px;
  margin-left: 8px;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 6px;
`;

const PaginationButton = styled.button`
  background-color: ${(props) => (props.active ? '#2E37A4' : '#CED1D7')};
  color: ${(props) => (props.active ? '#CED1D7' : 'inherit')};
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 4px;
  }

  &:has(span:first-child) {
    padding-right: 4px;
  }

  & svg {
    height: 18px;
    width: 18px;
  }

  &:hover:not(:disabled) {
    background-color: #2e37a4;
    color: #fff;
  }
`;

const Pagination = ({ count }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    searchParams.set('page', next);
    setSearchParams(searchParams);
  }
  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    searchParams.set('page', prev);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{' '}
        of <span>{count}</span> results
      </P>
      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeftIcon /> <span>Previous</span>
        </PaginationButton>
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <ChevronRightIcon /> <span>Next</span>
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
};

export default Pagination;
