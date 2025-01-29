// boutique/src/components/Chatbot.js
import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate a bot response
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: 'Hello! How can I help you?', sender: 'bot' }
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <style jsx>{`
        .chatbot {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 300px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .chat-window {
          max-height: 400px;
          overflow-y: auto;
          padding: 10px;
          flex-grow: 1;
        }

        .user {
          text-align: right;
          color: blue;
        }

        .bot {
          text-align: left;
          color: green;
        }

        .input-area {
          display: flex;
          padding: 10px;
        }

        .input-area input {
          flex-grow: 1;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .input-area button {
          margin-left: 10px;
          padding: 8px 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .input-area button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;