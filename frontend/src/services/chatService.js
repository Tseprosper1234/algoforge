// frontend/src/services/chatService.js
import api from './api';

export const getMessages = async (limit = 50, offset = 0) => {
  const response = await api.get(`/chat/messages?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const sendTextMessage = async (data) => {
  // data can be string or object
  let payload;
  if (typeof data === 'string') {
    payload = { content: data };
  } else {
    payload = data;
  }
  const response = await api.post('/chat/messages/text', payload);
  return response.data;
};

export const uploadAttachment = async (formData) => {
  const response = await api.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};