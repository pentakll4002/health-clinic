import classNames from '../utils/classNames';

const Button = ({
  type = '',
  children,
  className = 'text-white',
  isLoading = false,
  onClick = () => {},
  ...rest
}) => {
  return (
    <button
      type={type}
      className={classNames(
        'flex items-center justify-center py-3 text-base font-semibold  rounded-xl  min-h-[50px]',
        className,
        isLoading ? 'opacity-50 pointer-events-none' : ''
      )}
      {...rest}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
