import { StockMovement, Status, api, StockMovementType, QueryResult } from ".";

interface GetStockMovements {
  type: StockMovementType[];
  status?: Status[];
  search?: string;
  offset: number;
  limit: number;
}
interface CreateStockMovement {
  type: StockMovementType;
  date: string;
  entityId: string;
  documentNumber?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    batch?: string;
  }>;
}
interface EditStockMovement {
  date: string;
  entityId: string;
  status: Status;
  documentNumber?: string;
}

const getStockMovements = (
  params: GetStockMovements
): Promise<QueryResult<StockMovement>> => {
  return new Promise((resolve, reject) => {
    api
      .get("/stock_movements", { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const createStockMovement = (params: CreateStockMovement): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post("/stock_movements", params)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};

const getStockMovementsById = (
  stockMovementID: string | undefined
): Promise<StockMovement> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/stock_movements/${stockMovementID}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editStockMovements = (
  params: EditStockMovement,
  stockMovementsId: string | undefined
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/stock_movements/${stockMovementsId}`, params)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};

export {
  getStockMovements,
  createStockMovement,
  getStockMovementsById,
  editStockMovements,
};
