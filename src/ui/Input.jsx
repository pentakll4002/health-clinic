import { useController } from 'react-hook-form';

const Input = (props) => {
  const { control, name, type = 'text', placeholder, children, icon } = props;
  const { field } = useController({ control, name, defaultValue: '' });
  return (
    <div className='relative '>
      <span className='absolute left-4 top-[50%] -translate-y-[50%] w-6 h-6 '>
        {icon}
      </span>
      <input
        type={type}
        name={name}
        className='w-full px-4 py-2 pl-12 bg-white border rounded-lg border-grey-transparent shadow-1 placeholder:text-grey-300 '
        placeholder={placeholder}
        {...field}
      />

      {children && (
        <span className='absolute cursor-pointer select-none top-2/4 right-6 -translate-y-2/4 text-neutral-200'>
          {children}
        </span>
      )}
    </div>
  );
};

export default Input;
