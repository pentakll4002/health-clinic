import { NavLink } from 'react-router-dom';
import classNames from '../utils/classNames';
import styled from 'styled-components';

const Nav = styled.div`
  display: flex;
  padding: 12px 16px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const SidebarLink = ({ to, icon: Icon, label }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <Nav
          className={classNames(
            isActive ? 'ring-1 ring-grey-transparent rounded-md' : ''
          )}
        >
          {Icon && <Icon className='w-5 h-5 text-primary' />}
          <span className='text-sm font-medium text-grey-900'>{label}</span>
        </Nav>
      )}
    </NavLink>
  );
};

export default SidebarLink;
