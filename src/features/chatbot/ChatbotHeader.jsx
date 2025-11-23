import { MinusCircleIcon } from '@heroicons/react/24/outline';
import botIcon from '../../assets/chatbot-logo.png';

const ChatbotHeader = ({ onClose }) => (
  <div className='flex items-center p-3 text-white bg-primary'>
    <img src={botIcon} alt='Bot' className='w-8 h-8 mr-2' />
    <span className='font-semibold'>Chatbot hỗ trợ</span>
    <button
      style={{
        marginLeft: 'auto',
        background: 'none',
        border: 'none',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        cursor: 'pointer',
      }}
      onClick={onClose}
    >
      <MinusCircleIcon className='w-6 h-6' />
    </button>
  </div>
);

export default ChatbotHeader;
