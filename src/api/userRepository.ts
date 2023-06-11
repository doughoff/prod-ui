import { CreateUser, Status, User, api } from ".";
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

export { getAllUsers, createUser, checkEmail };
