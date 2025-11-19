import Dropdown from './Dropdown';
import SidebarLink from './SidebarLink';
import ButtonToggle from './ButtonToggle';

import {
  ApplicationSvg,
  AppointmentsSvg,
  DashboardSvg,
  DoctorsSvg,
  DrugSvg,
  LeavesSvg,
  MedicalFormSvg,
  PatientsSvg,
} from '../constants/Global';

import {
  ChatBubbleLeftRightIcon,
  Cog8ToothIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  MapPinIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <aside className='w-full h-full p-4 overflow-y-auto bg-white border-r border-grey-transparent'>
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
          icon={DoctorsSvg}
          label='Doctors'
          items={[
            { label: 'Doctors', to: '/' },
            { label: 'Doctors Details', to: '/?view=detail' },
            { label: 'Add Doctors', to: '/?modal=add-doctor' },
            { label: 'Doctors Schedule', to: '/appointments' },
          ]}
        />

        {/* Patients */}
        <Dropdown
          icon={PatientsSvg}
          label='Patients'
          items={[
            { label: 'Patients', to: '/patients' },
            { label: 'Patient Details', to: '/patients?view=detail' },
            { label: 'Add Patient', to: '/patients?modal=add-patient' },
            { label: 'My Profile', to: '/patients/profile' },
          ]}
        />

        {/* Drug Management */}
        <Dropdown
          icon={DrugSvg}
          label='Drug Management'
          items={[
            { label: 'All Drugs', to: '/drugs' },
            { label: 'Add Drug', to: '/drugs?modal=add-drug' },
            { label: 'Drug Usage Reports', to: '/drugs?tab=reports' },
          ]}
        />

        <SidebarLink to='/regulations' icon={Cog8ToothIcon} label='Regulations' />

        {/* Medical Forms */}
        <SidebarLink to='/medical-forms' icon={MedicalFormSvg} label='Medical Forms' />

        {/* Appointments */}
        <SidebarLink to='/appointments' icon={AppointmentsSvg} label='Appointments' />

        {/* Invoices */}
        <SidebarLink to='/invoices' icon={CurrencyDollarIcon} label='Invoices' />

        <SidebarLink to='/' icon={MapPinIcon} label='Locations' />
        <SidebarLink to='/' icon={ChatBubbleLeftRightIcon} label='Messages' />
      </div>

      {/* HRM */}
      <div className='flex flex-col mb-6'>
        <p className='px-2 mb-2 text-sm font-semibold text-grey-400'>HRM</p>

        <SidebarLink to='/' icon={UserGroupIcon} label='Staff' />
        <SidebarLink to='/' icon={CurrencyDollarIcon} label='Payroll' />

        <Dropdown
          icon={LeavesSvg}
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

        <SidebarLink to='/' icon={QuestionMarkCircleIcon} label='FAQ' />
        <SidebarLink to='/' icon={EnvelopeIcon} label='Newsletters' />
        <SidebarLink to='/patients/profile' icon={UserCircleIcon} label='Profile' />
        <SidebarLink
          to='/'
          icon={ShieldExclamationIcon}
          label='Privacy Policy'
        />
        <SidebarLink to='/' icon={Cog8ToothIcon} label='Setting' />
      </div>

      <div className='border border-grey-transparent'></div>

      <div className='flex items-center justify-between px-3 py-4 mt-5 border rounded-md border-grey-transparent shadow-1 gap-x-5'>
        <span>
          <MoonIcon className='w-5 h-5' />
        </span>

        <span>Dark Mode</span>

        <ButtonToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
