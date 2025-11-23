import React, { useState } from 'react';
import chatbotIcon from '../assets/icon-chatbot.png';
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
      // Chuyển đổi lịch sử sang dạng python backend yêu cầu
      const conversation_history = newMessages.map((msg) => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      const res = await axiosChatbot.post('/', {
        message: text,
        conversation_history,
        use_rag: false  // Use direct LLM chat (RAG requires vector store setup)
      });
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: res.data.answer }
      ]);
    } catch (e) {
      console.error('Chatbot error:', e);
      let errorMsg = 'Chatbot không phản hồi. Vui lòng thử lại sau.';
      
      if (e.code === 'ERR_NETWORK' || e.message?.includes('ECONNREFUSED')) {
        errorMsg = 'Không thể kết nối đến chatbot server. Vui lòng kiểm tra xem backend Python đã chạy chưa (port 8001).';
      } else if (e.response?.data?.detail) {
        // Hiển thị lỗi chi tiết từ backend
        errorMsg = `Lỗi: ${e.response.data.detail}`;
      } else if (e.response?.status === 500) {
        errorMsg = `Lỗi server (500): ${e.response?.data?.detail || 'Vui lòng kiểm tra log backend'}`;
      } else if (e.response?.status === 400) {
        errorMsg = `Lỗi cấu hình: ${e.response?.data?.detail || 'Vui lòng kiểm tra API keys trong file .env'}`;
      }
      
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: errorMsg }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {open && (
        <ChatbotFrame>
          <ChatbotHeader onClose={() => setOpen(false)} />
          <ChatbotOutput messages={messages} />
          <ChatbotInput onSend={handleSend} />
          {loading && <div style={{padding:6,fontSize:13,color:'#888',textAlign:'center'}}>Đang lấy phản hồi...</div>}
        </ChatbotFrame>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label="Mở chatbot"
      >
        <img
          src={chatbotIcon}
          alt="Chatbot"
          style={{ width: 64, height: 64, boxShadow: '0 4px 12px rgba(46,55,164,.3)', borderRadius: '50%' }}
        />
      </button>
    </div>
  );
};

export default ChatbotWidget;
