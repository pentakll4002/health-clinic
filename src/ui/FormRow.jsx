const FormRow = ({ label, children, name, error }) => {
  return (
    <div className='grid items-center gap-y-1.5 [&:first-child]:pt-0 [&:last-child]:pb-0'>
      {label && (
        <label
          htmlFor={name}
          className='inline text-sm font-medium cursor-pointer text-grey-900'
        >
          {label}
        </label>
      )}

      {children}

      <span className='text-sm text-error-900 min-h-[20px]'>
        {error || '\u00A0'}
      </span>
    </div>
  );
};

export default FormRow;
