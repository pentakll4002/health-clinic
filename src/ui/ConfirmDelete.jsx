import styled from 'styled-components';
import Button from './Button';

const StyledConfirmDelete = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  & p {
    color: #6b7280;
    margin-bottom: 12px;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
`;

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }) {
  // function handleConfirmClick() {}

  return (
    <StyledConfirmDelete>
      <h3 className='text-[20px] font-medium'>Xoá {resourceName}</h3>
      <p>
        Bạn có chắc chắn muốn xoá {resourceName} này vĩnh viễn không? Hành động
        này không thể hoàn tác!
      </p>

      <div>
        <Button
          className='px-3 py-1 bg-white border text-grey-600 border-grey-200 hover:bg-grey-100'
          onClick={onCloseModal}
        >
          Huỷ
        </Button>
        <Button
          className='px-3 py-1 text-error-200 bg-error-800 hover:bg-error-900'
          onClick={onConfirm}
          disabled={disabled}
        >
          Xoá
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
