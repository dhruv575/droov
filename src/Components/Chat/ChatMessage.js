import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const ChatMessage = ({ role, content }) => {
  return (
    <div className={`chat-message ${role}`}>
      <div className="chat-message-content">
        {role === 'user' ? (
          <div className="user-message">
            <div className="message-text">{content}</div>
          </div>
        ) : (
          <div className="assistant-message">
            <div className="message-text">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

