import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../../ui/Modal';
import CreateAppointmentForm from './CreateAppointmentForm';

const AddAppointment = () => {
  return (
    <div>
      <Modal>
        <Modal.Open opens='appointment-form'>
          <button className='py-[6px] px-[10px] bg-primary rounded-md flex items-center justify-center gap-x-2 text-white text-sm font-semibold'>
            <PlusIcon className='w-5 h-5' />
            <span>Đặt Lịch Hẹn</span>
          </button>
        </Modal.Open>

        <Modal.Window name='appointment-form'>
          <CreateAppointmentForm />
        </Modal.Window>
      </Modal>
    </div>
  );
};

export default AddAppointment;

