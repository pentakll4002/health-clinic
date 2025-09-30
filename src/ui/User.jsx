const User = () => {
  return (
    <div className='flex items-center gap-2'>
      <div className='relative w-8 h-8'>
        <div className='rounded-full h-9 w-9 aspect-square bg-user' />

        <div className='absolute -bottom-[6px] -right-[6px] bg-white rounded-full p-[2px]'>
          <div className='w-3 h-3 rounded-full bg-success-900' />
        </div>
      </div>
    </div>
  );
};

export default User;
