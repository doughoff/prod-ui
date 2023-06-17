import { StockMovement, Status, api, StockMovementType, QueryResult } from '.';

interface GetStockMovements {
  type: StockMovementType[];
  status?: Status[];
  search?: string;
  offset: number;
  limit: number;
}

const getStockMovements = (
  params: GetStockMovements
): Promise<QueryResult<StockMovement>> => {
  return new Promise((resolve, reject) => {
    api
      .get('/stock_movements', { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { getStockMovements };
