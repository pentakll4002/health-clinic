import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

const StyledFilter = styled.div`
  border: 1px solid #CED1D7;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
  padding: 4px;
  display: flex;
  gap: 4px;
`;

const FilterButton = styled.button`
  background-color: #fff;
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: #3C49BF;
      color: #E7ECFC;
    `}

  border-radius: 5px;
  font-weight: 500;
  font-size: 14px;
  padding: 4.4px 8px;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: #3C49BF;
    color: #E7ECFC;
  }
`;

function Filter({ filterField, options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    searchParams.set(filterField, value);

    if (searchParams.get('page')) searchParams.set('page', 1);

    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          key={option.value}
          active={option.value === currentFilter}
          disabled={option.value === currentFilter}
          onClick={() => handleClick(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}


export default Filter;
