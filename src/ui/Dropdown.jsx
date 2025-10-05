import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from '../utils/classNames';

const Dropdown = ({ icon: Icon, label, items = [] }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const toggle = () => setOpen(!open);

  return (
    <div className='w-full'>
      <div
        onClick={toggle}
        className={classNames(
          'flex items-center justify-between w-full px-4 py-3 transition-all bg-white rounded-lg cursor-pointer mb-3 select-none duration-200',
          open
            ? 'ring-1 ring-grey-200 hover:ring-primary-200'
            : 'ring-0 hover:ring-grey-100'
        )}
      >
        <div
          className={classNames(
            'flex items-center gap-2 text-sm font-medium',
            !open ? 'text-grey-900' : 'text-primary'
          )}
        >
          {Icon && <Icon className='w-4 h-4 text-primary' />}
          <span>{label}</span>
        </div>
        {open ? (
          <ChevronUpIcon className='w-4 h-4 text-grey-500' />
        ) : (
          <ChevronDownIcon className='w-4 h-4 text-grey-500' />
        )}
      </div>

      {/* Dropdown List */}
      {open && (
        <div className='flex flex-col mt-2 ml-6 space-y-2 border-l border-grey-200'>
          {items.map((item) => {
            const isActive = pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 pl-4 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-grey-500 hover:text-primary-700'
                }`}
              >
                <span
                  className={`absolute left-[-5px] h-2 w-2 rounded-full ${
                    isActive ? 'bg-primary' : 'bg-grey-200'
                  }`}
                />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
