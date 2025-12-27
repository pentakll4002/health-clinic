import { useState } from 'react';
import chatbotIcon from '../assets/chatbot-logo.png';
import ChatbotFrame from '../features/chatbot/ChatbotFrame';
import ChatbotHeader from '../features/chatbot/ChatbotHeader';
import ChatbotOutput from '../features/chatbot/ChatbotOutput';
import ChatbotInput from '../features/chatbot/ChatbotInput';
import { axiosChatbot } from '../utils/axiosInstance';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    const newMessages = [...messages, { from: 'user', text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const conversation_history = newMessages.map((msg) => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const res = await axiosChatbot.post('/', {
        message: text,
        conversation_history,
        use_rag: true, // Enable RAG to use roles data
      });

      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: res.data.answer },
      ]);
    } catch (e) {
      console.error('Chatbot error:', e);
      let errorMsg = 'Chatbot không phản hồi. Vui lòng thử lại sau.';

      if (e.code === 'ERR_NETWORK' || e.message?.includes('ECONNREFUSED') || e.message?.includes('Network Error')) {
        errorMsg =
          'Không thể kết nối đến chatbot server. Vui lòng kiểm tra:\n' +
          '1. Chatbot server đang chạy trên port 8002\n' +
          '2. Khởi động server: cd python-chatbot && python start_chatbot.py\n' +
          '3. Kiểm tra: http://localhost:8002/health';
      } else if (e.response?.data?.detail) {
        errorMsg = `Lỗi: ${e.response.data.detail}`;
      } else if (e.response?.status === 500) {
        errorMsg = `Lỗi server (500): ${
          e.response?.data?.detail || 'Vui lòng kiểm tra log backend'
        }`;
      } else if (e.response?.status === 400) {
        errorMsg = `Lỗi cấu hình: ${
          e.response?.data?.detail ||
          'Vui lòng kiểm tra API keys trong file .env'
        }`;
      }

      setMessages((prev) => [...prev, { from: 'bot', text: errorMsg }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 9999 }}>
      {open ? (
        <ChatbotFrame>
          <ChatbotHeader onClose={() => setOpen(false)} />
          <ChatbotOutput messages={messages} />
          <ChatbotInput onSend={handleSend} isLoading={loading} />
        </ChatbotFrame>
      ) : (
        <button
          onClick={() => setOpen((v) => !v)}
          className='p-2 rounded-full outline-none cursor-pointer shadow-1 bg-primary'
        >
          <img src={chatbotIcon} alt='Chatbot' className='w-10 h-10' />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
