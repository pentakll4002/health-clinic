
const ChatbotFrame = ({ children }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(44,62,80,.17)',
        width: 360,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};
export default ChatbotFrame;
