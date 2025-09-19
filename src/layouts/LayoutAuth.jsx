const LayoutAuth = ({ children, heading = '', paragraph = '', picture }) => {
  return (
    <div className='flex items-start justify-center min-h-screen bg-white'>
      <img
        src={picture}
        className='flex-1 object-cover max-h-screen min-h-screen'
      />
      <div className='flex items-center justify-center flex-1 min-h-screen '>
        <div className='flex flex-col justify-center p-5 rounded-[20px] border-grey-transparent border shadow-1 w-[500px]'>
          <h1 className='text-xl font-bold text-center text-grey-900'>
            {heading}
          </h1>
          <p className='mb-5 text-sm font-normal text-center text-grey-500 opacity-70'>
            {paragraph}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutAuth;
