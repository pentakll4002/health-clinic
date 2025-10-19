import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreatePatientForm from './CreatePatientForm';


const AddPatient = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='patient-form'>
          <button className=' py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Thêm Bệnh Nhân</span>
          </button>
        </Modal.Open>

        <Modal.Window name='patient-form'>
          <CreatePatientForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddPatient;
