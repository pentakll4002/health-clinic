import useToggleValue from '../hooks/useToggleValue';
import classNames from '../utils/classNames';

const ButtonToggle = () => {
  const { value: darkMode, handleToggleValue: handleSetDarkMode } =
    useToggleValue(false);
  return (
    <button
      className={classNames(
        'relative inline-flex items-center h-5 rounded-full w-9',
        !darkMode ? 'bg-grey-200' : 'bg-white'
      )}
      onClick={handleSetDarkMode}
    >
      <span
        className={classNames(
          'w-4 h-4 rounded-full transform transition-transform duration-300',
          !darkMode ? ' translate-x-1 bg-white' : ' translate-x-4 bg-dark'
        )}
      />
    </button>
  );
};

export default ButtonToggle;
