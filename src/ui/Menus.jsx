import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import useClickOutSide from '../hooks/useClickOutSide';
import { EllipsisVerticalIcon } from '@heroicons/react/16/solid';

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 5px;
  border: 1px solid #e7e8eb;
  transform: translateX(8px);
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  & svg {
    width: 24px;
    height: 24px;
    color: #374151;
  }
`;

const StyledList = styled.ul`
  position: fixed;

  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 7px;

  top: ${({ $position }) => $position?.y ?? 0}px;
  right: ${({ $position }) => $position?.x ?? 0}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  transition: all 0.2s;
  border: 0.25px solid #b6bbc4;

  display: flex;
  align-items: center;
  gap: 16px;

  &:hover {
    background-color: #b6bbc4;
  }

  & svg {
    width: 16px;
    height: 16px;
    color: #0a1b39;
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

function Menus({ children }) {
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const close = () => setOpenId('');
  const open = (id) => setOpenId(id);
  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    e.stopPropagation();
    const rect = e.target.closest('button').getBoundingClientRect();

    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    openId === '' || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <EllipsisVerticalIcon />
    </StyledToggle>
  );
}

function List({ id, children }) {
  const { openId, position } = useContext(MenusContext);
  const { nodeRef } = useClickOutSide(false);
  if (openId !== id) return null;
  const safePos = position ?? { x: 0, y: 0 };

  return createPortal(
    <StyledList $position={safePos} ref={nodeRef}>
      {children}
    </StyledList>,
    document.body
  );
}

function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon} <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
