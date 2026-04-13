import api from './api';

export const getFilesHierarchy = async () => {
  const response = await api.get('/files/hierarchy');
  return response.data;
};

export const getFileById = async (id) => {
  const response = await api.get(`/files/${id}`);
  return response.data;
};

export const submitQuiz = async (fileId, answers) => {
  const response = await api.post(`/files/${fileId}/quiz/submit`, { answers });
  return response.data;
};