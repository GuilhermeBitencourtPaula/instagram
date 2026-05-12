import api from './api';

export const getInstagramAuthUrl = async () => {
  const response = await api.get('/instagram/auth-url');
  return response.data.url;
};

export const getInstagramStatus = async () => {
  const response = await api.get('/instagram/status');
  return response.data;
};

export const disconnectInstagram = async () => {
  const response = await api.post('/instagram/disconnect');
  return response.data;
};
