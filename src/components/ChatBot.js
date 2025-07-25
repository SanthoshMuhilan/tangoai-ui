import React, { useState, useEffect, useRef } from 'react';

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today? [demo]' }
  ]);
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
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

  const renderMsg = (msg) => {
    if (msg.isJSX) return msg.text;
    if (typeof msg.text === 'string') {
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
      return <div>{msg.text}</div>;
    }
    return null;
  };

  const handleYes = () => {
    setMessages(msgs => [...msgs, { from: 'bot', text: 'Please provide more details.' }]);
  };

  const handleNo = () => {
    if (onClose) onClose();
  };

  return (
    <div className={`chatbot-popup${isMaximized ? ' chatbot-maximized' : ''}`}>
      <div className="chatbot-header">
        <span>ChatBot</span>
        <button
          className={`chatbot-max ${isMaximized ? 'chatbot-maximized' : ''}`}
          title={isMaximized ? "Restore" : "Maximize"}
          onClick={() => setIsMaximized(m => !m)}
        >
          {isMaximized ? '🗗' : '🗖'}
        </button>
        <button className="chatbot-close" onClick={onClose}>×</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-msg ${msg.from}`}>
            {renderMsg(msg)}
            {typeof msg.text === 'string' && msg.text.includes('Do you need any details about this file?') && (
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  gap: 16,
                  justifyContent: 'center',
                }}
              >
                <button
                  style={{
                    background: 'rgb(183, 158, 204)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 24px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                    transition: 'background 0.2s',
                  }}
                  onClick={handleYes}
                >
                  Yes
                </button>
                <button
                  style={{
                    background: '#eee',
                    color: '#3A294F',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 24px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                    transition: 'background 0.2s',
                  }}
                  onClick={handleNo}
                >
                  No
                </button>
              </div>
            )}
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