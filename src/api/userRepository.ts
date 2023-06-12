import { CreateUser, EditUser, Status, User, api } from ".";
const getAllUsers = (status?: Status): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    const params = status ? { status } : {};
    api
      .get("/users", { params })
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
      .post("/users", params)
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
        if (err.code == "ERR_BAD_REQUEST") {
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

export { getAllUsers, createUser, checkEmail, getUserById, editUser };
