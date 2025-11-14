import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateInvoiceForm from './CreateInvoiceForm';

const AddInvoice = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='invoice-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Tạo Hoá Đơn</span>
          </button>
        </Modal.Open>

        <Modal.Window name='invoice-form'>
          <CreateInvoiceForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddInvoice;


