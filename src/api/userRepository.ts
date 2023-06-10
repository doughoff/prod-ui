import { Status, User, api } from ".";
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
export { getAllUsers };
