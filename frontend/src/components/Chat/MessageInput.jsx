import React, { useState, useEffect, useRef } from 'react';

const MessageInput = ({ onSendMessage, onTyping, disabled, replyingTo, onCancelReply }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (onTyping) onTyping();
  };

  return (
    <div style={{ width: '100%' }}>
      {replyingTo && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '8px',
          borderLeft: '3px solid #3b82f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#3b82f6' }}>↩️ Replying to @{replyingTo.username}</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {replyingTo.content?.substring(0, 60)}{replyingTo.content?.length > 60 ? '...' : ''}
            </div>
          </div>
          <button
            onClick={onCancelReply}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="input-row">
        <input
          ref={inputRef}
          type="text"
          className="chat-text-input"
          placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <button type="submit" className="send-btn" disabled={disabled || !message.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
};

export default MessageInput;