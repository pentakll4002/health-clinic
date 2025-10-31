const FormRow = ({ label, children, name, error, inline = false }) => {
  return (
    <div
      className={`${
        inline ? 'flex items-center gap-3' : 'grid items-center gap-y-1.5'
      } [&:first-child]:pt-0 [&:last-child]:pb-0`}
    >
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium cursor-pointer text-grey-900 ${
            inline ? 'min-w-[130px] text-left' : ''
          } `}
        >
          {label}
        </label>
      )}

      {children}

      {error && (
        <span className='m-2 text-sm text-error-900 min-h-5'>{error}</span>
      )}
    </div>
  );
};

export default FormRow;
