import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReplyIndicator from './ReplyIndicator';
import config from '../../config';

const MessageList = ({ messages, onDownloadFile, onReply, onGoToMessage }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /*const getAvatarUrl = (avatarUrl, username) => {
    if (avatarUrl) {
      return `http://localhost:5000${avatarUrl}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}&background=3b82f6&color=fff&size=32&bold=true`;
  };*/

  const getAvatarUrl = (avatarUrl, username) => {
  if (avatarUrl) {
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return `${config.baseUrl}${avatarUrl}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || 'User')}&background=3b82f6&color=fff&size=32&bold=true`;
};

  /*const renderMessageContent = (msg) => {
    const fileUrl = msg.file_url ? `http://localhost:5000${msg.file_url}` : null;

    if (msg.message_type === 'text') {
      return <div className="message-text">{msg.content}</div>;
    } else if (msg.message_type === 'image') {
      return (
        <>
          <div className="message-text">📷 {msg.content}</div>
          <img
            src={fileUrl}
            alt={msg.content}
            className="attachment-preview"
            onClick={() => onDownloadFile(fileUrl, msg.content)}
            style={{ cursor: 'pointer' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x150?text=Image+Not+Found'; }}
          />
        </>
      );
    } else if (msg.message_type === 'video') {
      return (
        <>
          <div className="message-text">🎥 {msg.content}</div>
          <video
            src={fileUrl}
            controls
            className="attachment-preview"
          />
        </>
      );
    } else {
      return (
        <div 
          className="message-attachment" 
          onClick={() => onDownloadFile(fileUrl, msg.content)}
        >
          📄 {msg.content}
        </div>
      );
    }
  };*/

  const renderMessageContent = (msg) => {
  // Check if file_url is already a full URL
  const isFullUrl = msg.file_url && (msg.file_url.startsWith('http://') || msg.file_url.startsWith('https://'));
  const fileUrl = isFullUrl ? msg.file_url : (msg.file_url ? `http://localhost:5000${msg.file_url}` : null);

  if (msg.message_type === 'text') {
    return <div className="message-text">{msg.content}</div>;
  } else if (msg.message_type === 'image') {
    return (
      <>
        <div className="message-text">📷 {msg.content}</div>
        <img
          src={fileUrl}
          alt={msg.content}
          className="attachment-preview"
          onClick={() => onDownloadFile(fileUrl, msg.content)}
          style={{ cursor: 'pointer' }}
          onError={(e) => { 
            console.error('Image failed to load:', fileUrl);
            e.target.src = 'https://via.placeholder.com/200x150?text=Image+Not+Found'; 
          }}
        />
      </>
    );
  } else if (msg.message_type === 'video') {
    return (
      <>
        <div className="message-text">🎥 {msg.content}</div>
        <video
          src={fileUrl}
          controls
          className="attachment-preview"
          onError={(e) => console.error('Video failed to load:', fileUrl)}
        />
      </>
    );
  } else {
    return (
      <div 
        className="message-attachment" 
        onClick={() => onDownloadFile(fileUrl, msg.content)}
      >
        📄 {msg.content}
      </div>
    );
  }
};

  const handleReply = (msg) => {
    onReply(msg);
  };

  const handleGoToMessage = (messageId) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="empty-message" style={{ textAlign: 'center', padding: '40px' }}>
        💬 No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <>
      {messages.map(msg => {
        const isOwn = msg.user_id === user?.id;
        const avatarUrl = getAvatarUrl(msg.avatar_url, msg.username);
        
        return (
          <div 
            key={msg.id} 
            ref={el => messageRefs.current[msg.id] = el}
            className={`message ${isOwn ? 'message-own' : ''}`}
            style={{ transition: 'background-color 0.3s' }}
          >
            <div className="message-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={avatarUrl}
                  alt={msg.username}
                  style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    backgroundColor: '#3b82f6'
                  }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username || 'User')}&background=3b82f6&color=fff&size=32&bold=true`;
                  }}
                />
                <span style={{ fontWeight: '500' }}>{msg.username || 'Deleted User'}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
              <button
                onClick={() => handleReply(msg)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.7rem',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                ↩️ Reply
              </button>
            </div>
            
            {/* Show reply indicator if this message is a reply */}
            {msg.reply_to && (
              <ReplyIndicator 
                replyTo={msg.reply_to}
                onGoToMessage={() => handleGoToMessage(msg.reply_to.id)}
              />
            )}
            
            {renderMessageContent(msg)}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </>
  );
};

export default MessageList;