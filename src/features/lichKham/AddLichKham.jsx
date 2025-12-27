import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateLichKhamForm from './CreateLichKhamForm';

const AddLichKham = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='lich-kham-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Đặt lịch khám</span>
          </button>
        </Modal.Open>

        <Modal.Window name='lich-kham-form'>
          <CreateLichKhamForm
            onSuccess={() => {
              // Modal sẽ tự đóng khi form submit thành công
            }}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddLichKham;










