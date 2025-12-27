import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateDrugImportForm from './CreateDrugImportForm';

const AddDrugImport = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='drug-import-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Nhập Thuốc</span>
          </button>
        </Modal.Open>

        <Modal.Window name='drug-import-form'>
          <CreateDrugImportForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddDrugImport;


