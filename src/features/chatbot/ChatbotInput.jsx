import React, { useState } from "react";

const ChatbotInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div style={{ borderTop: '1px solid #eee', padding: 12, background: '#fff', display:'flex' }}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', fontSize: 15, borderRadius: 8, background: '#f6f8fa' }}
        placeholder="Nhập câu hỏi..."
      />
      <button
        onClick={handleSend}
        style={{ marginLeft: 8, background: '#2e37a4', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
      >
        Gửi
      </button>
    </div>
  );
};

export default ChatbotInput;
