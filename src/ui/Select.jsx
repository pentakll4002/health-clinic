import styled from 'styled-components';

const Select = styled.select.attrs()`
  border: 1px solid #E7E8EB;
  background-color: #fff;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export default Select;

