import { cloneElement, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useClickOutSide from '../hooks/useClickOutSide';

const StyledModal = styled.div`
  width: 90%;
  height: 100%;
  max-width: 800px;
  position: fixed;
  right: 0;
  overflow-y: auto;
  background-color: #fff;
  padding: 24px 32px;
  box-shadow: 0 24px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 5px;
  transform: translateX(50%);
  transition: all 0.2s;
  position: absolute;
  top: 12px;
  right: 19px;

  &:hover {
    background-color: #f3f4f6;
  }

  & svg {
    width: 24px;
    height: 24px;
    color: #6b7280;
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('');
  const open = (name) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useClickOutSide(close);
  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <XMarkIcon />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
