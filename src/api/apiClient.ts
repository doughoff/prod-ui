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
