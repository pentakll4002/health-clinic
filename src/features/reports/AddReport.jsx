import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateReportForm from './CreateReportForm';

const AddReport = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='report-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Lập Báo Cáo</span>
          </button>
        </Modal.Open>

        <Modal.Window name='report-form'>
          <CreateReportForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddReport;

