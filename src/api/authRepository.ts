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
      .then((res) => {
        if (res.data.session_id) {
          localStorage.setItem('sessionID', res.data.session_id);
          resolve(true);
        } else {
          console.error('api didnt return session id');
          reject('err_login');
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const logout = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const sessionID = localStorage.getItem('sessionID');
    if (!sessionID) {
      resolve(true);
      return;
    }

    api
      .post('/auth/logout')
      .then(() => {
        localStorage.removeItem('sessionID');
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { login, logout };
