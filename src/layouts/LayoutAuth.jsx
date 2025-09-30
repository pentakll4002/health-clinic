import { CheckIcon } from '@heroicons/react/24/outline';

const LayoutAuth = ({
  children,
  heading = '',
  paragraph = '',
  picture,
  check = false,
}) => {
  return (
    <div className='flex items-start justify-center min-h-screen bg-white'>
      <img src={picture} className='flex-1 object-cover max-h-screen' />
      <div className='flex items-center justify-center flex-1 min-h-screen '>
        <div className='flex flex-col justify-center p-5 rounded-[20px] border-grey-transparent border shadow-1 w-[500px]'>
          {check && (
            <div className='flex justify-center mb-4'>
              <div className='flex items-center justify-center w-12 h-12 text-center rounded-full bg-success'>
                <CheckIcon className='w-8 h-8 text-white' />
              </div>
            </div>
          )}

          <h1 className='text-xl font-bold text-center text-grey-900'>
            {heading}
          </h1>

          <p className='mb-4 text-sm font-normal text-center text-grey-500 opacity-70'>
            {paragraph}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutAuth;
