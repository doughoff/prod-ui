import { Entities, Status, api } from ".";

interface GetEntitites {
  status?: Status[];
  search?: string;
  offset: number;
  limit: number;
}
interface CreateEntities {
  name: string;
  ci?: string;
  ruc?: string;
}

interface EditEntities {
  name: string;
  ci?: string;
  ruc?: string;
  status: Status;
}

const getEntitites = (params: GetEntitites): Promise<Entities[]> => {
  return new Promise((resolve, reject) => {
    api
      .get("/entities", { params })
      .then((res) => {
        resolve(res.data.items);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const createEntities = (params: CreateEntities): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post("/entities", params)
      .then((res) => {
        console.log(res);
        resolve(true);
      })
      .catch((err) => {
        if (err.response.data.message == "entity with RUC already exists") {
          return reject("RUC ya existe");
        }
        if (err.response.data.message == "entity with CI already exists") {
          return reject("CI ya existe");
        }
        return reject("Error al crear Proveedor");
      });
  });
};
const getEntitieById = (entitieId: string | undefined): Promise<Entities> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/entities/${entitieId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editEntities = (
  params: EditEntities,
  entitiesId: string | undefined
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/entities/${entitiesId}`, params)
      .then((res) => {
        console.log(res);
        resolve(true);
      })
      .catch((err) => {
        if (err.response.data.message == "entity with RUC already exists") {
          return reject("RUC ya exsite");
        }
        if (err.response.data.message == "entity with CI already exists") {
          return reject("CI ya existe");
        }
        return reject("Error al editar Proveedor");
      });
  });
};

export { getEntitites, createEntities, editEntities, getEntitieById };
