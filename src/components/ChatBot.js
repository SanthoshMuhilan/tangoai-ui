import React, { useState, useEffect, useRef } from 'react'; // <-- add useRef

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today? [demo]' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: e.detail }
      ]);
    };
    window.addEventListener("chatbot-message", handler);
    return () => window.removeEventListener("chatbot-message", handler);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { from: 'bot', text: "I'm just a demo bot. I'll connect you to support soon!" }
      ]);
    }, 800);
  };

  // Helper to render message, with demo button if needed
  const renderMsg = (msg) => {
    if (msg.text.includes('[demo]')) {
      return (
        <span>
          Hi! How can I help you today?
          <br />
          <button
            className="chatbot-demo-btn"
            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
          >
            ▶️ Watch Demo
          </button>
        </span>
      );
    }
    return msg.text;
  };

  return (
    <div className="chatbot-popup">
      <div className="chatbot-header">
        <span>ChatBot</span>
        <button className="chatbot-close" onClick={onClose}>×</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-msg ${msg.from}`}>
            {renderMsg(msg)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-inputbar" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBot;