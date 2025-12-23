import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateDoctorForm from './CreateDoctorForm';
import { useRolePermissions } from '../../hooks/useRolePermissions';

const AddDoctor = () => {
  const { isRole } = useRolePermissions();

  if (!isRole('@admin')) return null;

  return (
    <div>
      <Modal>
        <Modal.Open opens='doctor-form'>
          <button className=' py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Thêm Bác Sĩ</span>
          </button>
        </Modal.Open>

        <Modal.Window name='doctor-form'>
          <CreateDoctorForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddDoctor;
