import Dropdown from './Dropdown';
import { ApplicationSvg, DashboardSvg } from '../constants/Global';
import { MapPinIcon, MoonIcon } from '@heroicons/react/24/outline';
import SidebarLink from './SidebarLink';

const Sidebar = () => {
  return (
    <aside className='w-full h-full p-4 overflow-y-auto bg-white'>
      {/* Main Menu */}
      <div className='mb-6'>
        <p className='px-2 mb-2 text-sm font-semibold text-grey-400'>
          Main Menu
        </p>

        {/* Dashboard */}
        <Dropdown
          icon={DashboardSvg}
          label='Dashboard'
          items={[
            { label: 'Admin Dashboard', to: '/admin-dashboard' },
            { label: 'Doctor Dashboard', to: '/doctor-dashboard' },
            { label: 'Patient Dashboard', to: '/patient-dashboard' },
          ]}
        />

        {/* Application */}
        <Dropdown
          icon={ApplicationSvg}
          label='Application'
          items={[
            { label: 'Chat', to: '/admin-dashboard' },
            { label: 'Call', to: '/doctor-dashboard' },
            { label: 'Invoices', to: '/patient-dashboard' },
          ]}
        />
      </div>

      {/* Clinic */}
      <div className='flex flex-col mb-6'>
        <p className='px-2 mb-2 text-sm font-semibold text-grey-400'>Clinic</p>

        {/* Doctors */}
        <Dropdown
          icon={DashboardSvg}
          label='Doctors'
          items={[
            { label: 'Doctors', to: '/admin-dashboard' },
            { label: 'Doctors Details', to: '/doctor-dashboard' },
            { label: 'Add Doctors', to: '/patient-dashboard' },
            { label: 'Doctors Schedule', to: '/patient-dashboard' },
          ]}
        />

        {/* Patients */}
        <Dropdown
          icon={ApplicationSvg}
          label='Patients'
          items={[
            { label: 'Patients', to: '/admin-dashboard' },
            { label: 'Patients Details', to: '/doctor-dashboard' },
            { label: 'Create Patients', to: '/patient-dashboard' },
          ]}
        />

        {/* Appointments */}
        <Dropdown
          icon={ApplicationSvg}
          label='Appointments'
          items={[
            { label: 'Appointments', to: '/admin-dashboard' },
            { label: 'New Appointments', to: '/doctor-dashboard' },
            { label: 'Calendar', to: '/patient-dashboard' },
          ]}
        />

        <SidebarLink to='/' icon={MapPinIcon} label='Locations' />
        <SidebarLink to='/' icon={MapPinIcon} label='Messages' />
      </div>

      {/* HRM */}
      <div className='flex flex-col mb-6'>
        <p className='px-2 mb-2 text-sm font-semibold text-grey-400'>HRM</p>

        <SidebarLink to='/' icon={MapPinIcon} label='Staff' />
        <SidebarLink to='/' icon={MapPinIcon} label='Payroll' />

        <Dropdown
          icon={ApplicationSvg}
          label='Leaves'
          items={[
            { label: 'Leaves', to: '/admin-dashboard' },
            { label: 'Leave Type', to: '/doctor-dashboard' },
          ]}
        />
      </div>

      {/* Support */}
      <div className='flex flex-col mb-6'>
        <p className='px-2 mb-2 text-sm font-semibold text-grey-400'>Support</p>

        <SidebarLink to='/' icon={MapPinIcon} label='FAQ' />
        <SidebarLink to='/' icon={MapPinIcon} label='Newsletters' />
        <SidebarLink to='/' icon={MapPinIcon} label='Profile' />
        <SidebarLink to='/' icon={MapPinIcon} label='Privacy Policy' />
      </div>

      <div className='border border-grey-transparent'></div>

      <div className='flex items-center justify-between px-3 py-4 mt-5 border rounded-md border-grey-transparent shadow-1 gap-x-5'>
        <span>
          <MoonIcon className='w-5 h-5' />
        </span>

        <span>Dark Mode</span>

        <span>nút</span>
      </div>
    </aside>
  );
};

export default Sidebar;
