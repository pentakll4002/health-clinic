const ButtonSocial = ({ ImgSocial, onClick = () => {} }) => {
  return (
    <button
      className='w-[112px] h-[40px] py-2 px-3 flex items-center justify-center bg-white border-grey-transparent border-[1.1px] rounded-md'
      onClick={onClick}
    >
      <img src={ImgSocial} className='w-5 h-5' alt='logo' />
    </button>
  );
};

export default ButtonSocial;
