import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreatePhieuKhamForm from './CreatePhieuKhamForm';

const AddPhieuKham = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='phieu-kham-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Tạo Phiếu Khám</span>
          </button>
        </Modal.Open>

        <Modal.Window name='phieu-kham-form'>
          <CreatePhieuKhamForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddPhieuKham;

