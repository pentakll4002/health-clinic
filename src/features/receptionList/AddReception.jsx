import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import ReceptionFormNew from './ReceptionFormNew';


const AddReception = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='reception-form'>
          <button className=' py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Thêm hồ sơ</span>
          </button>
        </Modal.Open>

        <Modal.Window name='reception-form'>
          <ReceptionFormNew />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddReception;
