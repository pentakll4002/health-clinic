import { useEffect, useRef } from 'react';

const ChatbotOutput = ({ messages }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={ref} className='flex-1 p-4 overflow-y-auto bg-light'>
      {messages && messages.length > 0 ? (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mx-2 my-0 ${
              msg.from === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <span
              className={`inline-block max-w-[220px] text-base px-4 py-2 rounded-xl ${
                msg.from === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-light text-grey-900'
              } `}
            >
              {msg.text}
            </span>
          </div>
        ))
      ) : (
        <div className='mt-2 text-sm text-center text-grey-800'>
          Chào mừng bạn đến với chatbot!
        </div>
      )}
    </div>
  );
};

export default ChatbotOutput;
