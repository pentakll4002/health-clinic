import { useState } from 'react';
import buttonIcon from '../../assets/send.png';
import SpinnerMini from '../../ui/SpinnerMini';

const ChatbotInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className=' relative p-3 flex bg-white border-t border-grey-transparent min-h-[56px]'>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className={` relative flex-1 px-[20px] py-[22px] text-[18px] border-none rounded-lg outline-none bg-light ${
          isLoading ? ' opacity-0' : ''
        }`}
        placeholder='Nhập câu hỏi'
      />

      {isLoading && (
        <div className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
          <SpinnerMini />
        </div>
      )}

      <button
        onClick={handleSend}
        className={`absolute cursor-pointer bottom-9 right-6 ${
          isLoading ? ' opacity-0' : ''
        }`}
      >
        <img src={buttonIcon} className='w-6 h-6 ' />
      </button>
    </div>
  );
};

export default ChatbotInput;
