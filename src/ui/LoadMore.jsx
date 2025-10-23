
import styled from 'styled-components';
import { PAGE_SIZE_LOAD_MORE } from '../constants/Global';

const Load = styled.button`
  margin: 0 auto;
  margin-top: 10px;
  width: 100px;
  display: flex;
  padding: 6px 10px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  border: 1px solid #e7e8eb;
  background: #fff;
`;

const LoadMore = ({ onClick, disabled }) => {
  return (
    <Load onClick={onClick} disabled={disabled}>
      <span className='font-semibold text-center text-grey-900 text-[13px] leading-[19.5px]'>
        Tải thêm
      </span>
      <span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='13'
          height='13'
          viewBox='0 0 13 13'
          fill='none'
        >
          <path
            d='M6.5 1.625C5.53582 1.625 4.59329 1.91091 3.7916 2.44659C2.98991 2.98226 2.36507 3.74363 1.99609 4.63442C1.62711 5.52521 1.53057 6.50541 1.71867 7.45106C1.90678 8.39672 2.37108 9.26536 3.05286 9.94714C3.73464 10.6289 4.60328 11.0932 5.54894 11.2813C6.49459 11.4694 7.47479 11.3729 8.36558 11.0039C9.25637 10.6349 10.0177 10.0101 10.5534 9.2084C11.0891 8.40671 11.375 7.46418 11.375 6.5'
            stroke='#0A1B39'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </span>
    </Load>
  );
};

export default LoadMore;
