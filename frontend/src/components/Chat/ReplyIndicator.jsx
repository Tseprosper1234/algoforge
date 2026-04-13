import React from 'react';

const ReplyIndicator = ({ replyTo, onGoToMessage }) => {
  if (!replyTo) return null;
  
  const replyText = replyTo.message_type === 'text' 
    ? replyTo.content 
    : `[${replyTo.message_type}] ${replyTo.content}`;
  
  return (
    <div 
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '8px 12px',
        marginBottom: '8px',
        borderLeft: '3px solid #3b82f6',
        cursor: 'pointer',
        fontSize: '0.8rem'
      }}
      onClick={onGoToMessage}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>↩️ Replying to @{replyTo.username}</span>
      </div>
      <div style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {replyText.length > 80 ? replyText.substring(0, 80) + '...' : replyText}
      </div>
    </div>
  );
};

export default ReplyIndicator;