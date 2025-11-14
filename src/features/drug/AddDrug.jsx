import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateDrugForm from './CreateDrugForm';

const AddDrug = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='drug-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Thêm Thuốc</span>
          </button>
        </Modal.Open>

        <Modal.Window name='drug-form'>
          <CreateDrugForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddDrug;

