import React from "react";
import botIcon from "../../assets/icon-chatbot.png";

const ChatbotHeader = ({ onClose }) => (
  <div style={{ background: '#2e37a4', color: '#fff', padding: 12, display: 'flex', alignItems: 'center' }}>
    <img src={botIcon} alt="Bot" style={{ width: 32, height: 32, marginRight: 8 }} />
    <span style={{ fontWeight: 600 }}>Chatbot hỗ trợ</span>
    <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: 20, cursor: 'pointer' }} onClick={onClose}>×</button>
  </div>
);

export default ChatbotHeader;
