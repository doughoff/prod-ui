import { api, initializeApi } from './apiClient';
import { Status, User } from './types';

interface AuthRepository {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  // profile: () => Promise<User>;
}

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
          setTimeout(() => {
            initializeApi();
          }, 100);
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

export { login };
