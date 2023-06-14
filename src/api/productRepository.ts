import { CreateProduct, EditProduct, Product, Status, api } from ".";
const getAllProducts = (status?: Status): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const params = status ? { status } : {};
    api
      .get("/products", { params })
      .then((res) => {
        resolve(res.data.items);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const createProduct = (params: CreateProduct): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post("/products", params)
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

const checkBarcode = (barcode: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/check_barcode/${barcode}`)
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
const getProductById = (productId: string | undefined): Promise<Product> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/products/${productId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const editProduct = (
  params: EditProduct,
  productId: string | undefined
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/products/${productId}`, params)
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

export {
  getAllProducts,
  createProduct,
  checkBarcode,
  editProduct,
  getProductById,
};
