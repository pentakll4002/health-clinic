import LayoutAuth from '../../layouts/LayoutAuth';

import SuccessImg from '../../assets/success.png';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  return (
    <LayoutAuth
      heading='Success'
      paragraph='Your new password has been successfully saved.'
      picture={SuccessImg}
      check={true}
    >
      <Button
        className='w-full my-5 text-white bg-primary'
        onClick={() => {
          navigate('/sign-in');
        }}
      >
        Back to Login
      </Button>
    </LayoutAuth>
  );
};

export default Success;
