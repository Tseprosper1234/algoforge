import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Moderation = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadMessages();
  }, []);
  
  const loadMessages = async () => {
    try {
      const response = await api.get('/chat/messages?limit=100');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/chat-messages/${id}`);
      loadMessages();
    } catch (error) {
      console.error('Failed to delete message', error);
      alert('Failed to delete message');
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <div>
      <h3>Chat Moderation</h3>
      <div className="list-card" style={{ marginTop: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <div><strong>{msg.username || 'Deleted User'}</strong> - {new Date(msg.created_at).toLocaleString()}</div>
            <div>{msg.message_type === 'text' ? msg.content : `[${msg.message_type}] ${msg.content}`}</div>
            <button onClick={() => deleteMessage(msg.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moderation;