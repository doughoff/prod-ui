import { message } from 'antd';
import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3088',
  withCredentials: true, // Required to handle cookiess
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (!error) {
      message.error(
        'Ocurrió un error en el cliente. Por favor, póngase en contacto con el administrador.'
      );
      window.history.pushState({}, '', '/login');
      window.location.reload();
    }

    // Network Connection error
    else if (error.message && error.message === 'Network Error') {
      message.error(
        'Ocurrió un problema al conectarse a Internet. Por favor, compruebe su conexión.'
      );
    }
    // RESPONSE ERROR WITHOUT SPECIFICATIONS
    else if (!error.response) {
      message.error(
        'No fue posible interpretar el error. Por favor, póngase en contacto con el administrador.'
      );
    }

    if (error?.response?.status && error.response?.status === 401) {
      localStorage.removeItem('loggedIn');
      window.history.pushState({}, '', '/login');
      window.location.reload();
    }

    // FORBIDEN AUTHENTICATION
    else if (error.response?.status && error.response.status === 403) {
      message.error('Access to the screen blocked!');
      window.history.back();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
