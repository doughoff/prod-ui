import { Recipe, Status, api } from ".";

interface GetRecipes {
  status?: Status[];
  search?: string;
  offset: number;
  limit: number;
}
interface CreateAndEditRecipes {
  name: string;
  producedQuantity: number;
  productId: string;
  ingredients: Array<{
    quantity: number;
    productId: string;
  }>;
}

interface DeleteRecipeGroup {
  status: Status;
}

const getRecipes = (params: GetRecipes): Promise<Recipe[]> => {
  return new Promise((resolve, reject) => {
    api
      .get("/recipes", { params })
      .then((res) => {
        resolve(res.data.items);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const createRecipes = (params: CreateAndEditRecipes): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .post("/recipes", params)
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
const editRecipes = (
  params: CreateAndEditRecipes,
  recipeID: string | undefined
): Promise<Recipe> => {
  return new Promise((resolve, reject) => {
    api
      .put(`/recipes/${recipeID}`, params)
      .then((res) => {
        console.log(res);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const getRecipeById = (recipesId: string | undefined): Promise<Recipe> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/recipes/${recipesId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getRecipeGroup = (
  recipesGroupId: string | undefined
): Promise<Recipe[]> => {
  return new Promise((resolve, reject) => {
    api
      .get(`/recipes_group/${recipesGroupId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const deleteRecipeGroup = (
  params: DeleteRecipeGroup,
  recipeGroupId: string | undefined
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    api
      .patch(`/recipes_group/${recipeGroupId}/status`, params)
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
  getRecipes,
  createRecipes,
  editRecipes,
  getRecipeById,
  getRecipeGroup,
  deleteRecipeGroup,
};
