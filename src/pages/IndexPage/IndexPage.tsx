import React from "react";
import { PageContent, PageHeader } from "../../components";
import {
  createRecipes,
  deleteRecipeGroup,
  editRecipes,
  getRecipeById,
  getRecipeGroup,
  getRecipes,
} from "../../api";

const IndexPage: React.FC = () => {
  return (
    <>
      <PageHeader
        items={[
          {
            title: "App",
          },
        ]}
        pageTitle="Pagina de Inicio"
      />
      <PageContent>
        <div className="flex flex-col w-fit">
          <button
            onClick={() => {
              getRecipes({
                limit: 100,
                offset: 0,
                status: "ACTIVE,INACTIVE",
              }).then((res) => console.log(res));
            }}
          >
            Get Recipes
          </button>
          <button
            onClick={() => {
              createRecipes({
                name: "Agua Mineral",
                productId: "1d74b30a-8813-4f9a-8136-8c28d0238d2c",
                producedQuantity: 10,
                ingredients: [
                  {
                    productId: "1d74b30a-8813-4f9a-8136-8c28d0238d2c",
                    quantity: 100,
                  },
                  {
                    productId: "75e8ea88-39bf-4bb9-8f65-f1d1ed4000b0",
                    quantity: 100,
                  },
                ],
              }).then((res) => console.log(res));
            }}
          >
            Create Recipes
          </button>
          <button
            onClick={() => {
              editRecipes(
                {
                  name: "Agua Mineral Editada",
                  productId: "1d74b30a-8813-4f9a-8136-8c28d0238d2c",
                  producedQuantity: 10,
                  ingredients: [
                    {
                      productId: "1d74b30a-8813-4f9a-8136-8c28d0238d2c",
                      quantity: 100,
                    },
                    {
                      productId: "75e8ea88-39bf-4bb9-8f65-f1d1ed4000b0",
                      quantity: 100,
                    },
                  ],
                },
                "068afe7e-d20c-49b4-a302-3b4b363d1d5d"
              ).then((res) => console.log(res));
            }}
          >
            Edit Recipes
          </button>

          <button
            onClick={() => {
              getRecipeById("bc459626-7b33-426b-9b00-6318fc782332").then(
                (res) => console.log(res)
              );
            }}
          >
            Get Recipes by Id
          </button>
          <button
            onClick={() => {
              getRecipeGroup("afde6fcc-4f05-40ef-a82f-454e52a3a70b").then(
                (res) => console.log(res)
              );
            }}
          >
            Get Recipes Group by Id
          </button>
          <button
            onClick={() => {
              deleteRecipeGroup(
                { status: "INACTIVE" },
                "afde6fcc-4f05-40ef-a82f-454e52a3a70b"
              ).then((res) => console.log(res));
            }}
          >
            Delete Recipes Group by Id
          </button>
        </div>
      </PageContent>
    </>
  );
};

export default IndexPage;
