import { api } from './apiClient';

const login = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post<{
        session_id: string;
      }>('/auth/login', {
        email,
        password,
      })
      .then(() => {
        localStorage.setItem('loggedIn', 'true');
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const logout = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post('/auth/logout')
      .then(() => {
        localStorage.removeItem('loggedIn');
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { login, logout };
