import { createContext, useContext } from 'react';
import styled from 'styled-components';

const StyledTable = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 14px;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const CommonRow = styled.header`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  background-color: #fff;
  column-gap: 24px;
  align-items: center;
  transition: none;
`;

const StyledHeader = styled(CommonRow)`
  padding: 16px 24px;

  background-color: #fff;
  border-bottom: 1px solid #f3f4f6;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: #0A1B39;
`;

const StyledBody = styled.section`
  margin: 4px 0;
`;

const StyledRow = styled(CommonRow)`
  padding: 12px 24px;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const Empty = styled.p`
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin: 24px;
`;

const TableContext = createContext();

function Table({ columns, children }) {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable role='table'>{children}</StyledTable>
    </TableContext.Provider>
  );
}

function Header({ children }) {
  const { columns } = useContext(TableContext);

  return (
    <StyledHeader role='row' columns={columns} as='header'>
      {children}
    </StyledHeader>
  );
}
function Row({ children }) {
  const { columns } = useContext(TableContext);

  return (
    <StyledRow role='row' columns={columns}>
      {children}
    </StyledRow>
  );
}
function Body({ data, render }) {
  if (!data.length) return <Empty>Không có dữ liệu</Empty>;

  return <StyledBody>{data.map(render)}</StyledBody>;
}

Table.Header = Header;
Table.Row = Row;
Table.Body = Body;

export default Table;