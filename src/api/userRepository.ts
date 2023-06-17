import { Role, Status, User, api } from '.';

interface GetUsers {
  status?: Status;
  search?: string;
  limit: number;
  offset: number;
}
interface CreateUser {
  name: string;
  email: string;
  password: string;
  roles: Role[];
}
interface EditUser {
  name: string;
  email: string;
  roles: Role[];
  status: Status;
}

const getUsers = (params: GetUsers): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    api
      .get('/users', { params })
      .then((res) => {
        resolve(res.data.items);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const createUser = (params: CreateUser): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post('/users', params)
      .then((res) => {
        console.log(res);
        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        reject(false);
      });
  });
};

const checkEmail = (email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/check_email/${email}`)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        if (err.code == 'ERR_BAD_REQUEST') {
          resolve(false);
        } else {
          reject(err);
        }
      });
  });
};
const getUserById = (userId: string | undefined): Promise<User> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/users/${userId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editUser = (
  params: EditUser,
  userId: string | undefined
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    console.log(params);
    console.log(userId);
    api
      .put(`/users/${userId}`, params)
      .then((res) => {
        console.log(res);

        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        reject(false);
      });
  });
};

export { getUsers, createUser, checkEmail, getUserById, editUser };
