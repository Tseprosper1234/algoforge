import React, { useState, useEffect } from 'react';
import { getMessages, sendTextMessage, uploadAttachment } from '../../services/chatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import AttachmentUpload from './AttachmentUpload';
import config from '../../config';

const ChatForum = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages(100, 0);
      setMessages(data.reverse());
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoading(false);
    }
  };

// In ChatForum.jsx, update handleSendText
const handleSendText = async (text) => {
  setSending(true);
  try {
    const payload = {
      content: text
    };
    
    // Add reply info if replying to a message
    if (replyingTo) {
      payload.parent_id = replyingTo.id;
      payload.reply_to_username = replyingTo.username;
    }
    
    await sendTextMessage(payload);
    setReplyingTo(null);
    await loadMessages();
  } catch (error) {
    console.error('Failed to send message', error);
    alert('Failed to send message');
  } finally {
    setSending(false);
  }
};

const handleFileUpload = async (file, type) => {
  setSending(true);
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add reply info if replying to a message
    if (replyingTo) {
      formData.append('parent_id', replyingTo.id);
      formData.append('reply_to_username', replyingTo.username);
    }
    
    await uploadAttachment(formData);
    setReplyingTo(null);
    await loadMessages();
  } catch (error) {
    console.error('Failed to upload file', error);
    alert('Failed to upload file');
  } finally {
    setSending(false);
  }
};

  /*const handleDownloadFile = (url, filename) => {
    window.open(url, '_blank');
  };

  const handleDownloadFile = (url, filename) => {
  // If URL is from Supabase, it's already full URL
  if (url.startsWith('http')) {
    window.open(url, '_blank');
  } else {
    window.open(`${config.baseUrl}${url}`, '_blank');
  }
};*/

const handleDownloadFile = (url, filename) => {
  // If URL is empty or invalid
  if (!url) {
    console.error('No URL provided');
    alert('File URL not available');
    return;
  }
  
  // If URL already starts with http (Supabase URL), open directly
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.open(url, '_blank');
  } else {
    // For local development (relative paths)
    window.open(`http://localhost:5000${url}`, '_blank');
  }
};

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleGoToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) return <div className="loading">Loading messages...</div>;

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <MessageList 
          messages={messages} 
          onDownloadFile={handleDownloadFile}
          onReply={handleReply}
          onGoToMessage={handleGoToMessage}
        />
      </div>
      
      <div className="chat-input-area">
        <MessageInput 
          onSendMessage={handleSendText}
          disabled={sending}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
        <AttachmentUpload 
          onUpload={handleFileUpload}
          disabled={sending}
        />
      </div>
    </div>
  );
};

export default ChatForum;