import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3088',
});

api.interceptors.request.use((config) => {
  const sessionID = localStorage.getItem('sessionID');

  if (sessionID) {
    config.headers['x-session'] = sessionID;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sessionID');
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
