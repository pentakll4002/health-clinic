import React, { useEffect, useRef } from "react";

const ChatbotOutput = ({ messages }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={ref}
      style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f8f9fa" }}
    >
      {messages && messages.length > 0 ? (
        messages.map((msg, idx) => (
          <div key={idx} style={{margin:'8px 0',textAlign: msg.from==="user"?'right':'left'}}>
            <span
              style={{
                display:'inline-block',
                background: msg.from==="user" ? '#2e37a4': '#e4e8fd',
                color: msg.from==="user"? '#fff' : '#222',
                borderRadius: 12,
                padding: '8px 14px',
                maxWidth: 220,
                fontSize: 14
              }}
            >
              {msg.text}
            </span>
          </div>
        ))
      ) : (
        <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
          Chào mừng bạn đến với chatbot!
        </div>
      )}
    </div>
  );
};

export default ChatbotOutput;
