const FormRow = ({ label, children, name, error, inline = false }) => {
  return (
    <div
      className={`${
        inline ? 'flex items-start gap-3' : 'grid items-center gap-y-1.5'
      } [&:first-child]:pt-0 [&:last-child]:pb-0`}
    >
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium cursor-pointer text-grey-900 ${
            inline ? 'w-[130px] text-left mt-2 shrink-0' : ''
          }`}
        >
          {label}
        </label>
      )}

      
      <div className='flex flex-col flex-1'>
        {children}
        {error && (
          <span className='mt-1 text-sm text-error-900 min-h-5'>{error}</span>
        )}
      </div>
    </div>
  );
};

export default FormRow;
