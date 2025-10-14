import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateDoctorForm from './CreateDoctorForm';

const AddDoctor = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='cabin-form'>
          <button className=' py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>New Doctor</span>
          </button>
        </Modal.Open>

        <Modal.Window name='cabin-form'>
          <CreateDoctorForm label='Thông tin bác sĩ' />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddDoctor;
