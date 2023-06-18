import { ConfigProvider } from "antd";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import esES from "antd/locale/es_ES";
import {
  IndexPage,
  LoginPage,
  UserListingPage,
  Index,
  UserDetailPage,
} from "./pages";
import AppTemplate from "./components/templates/AppTemplate";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductDetailPage, ProductListingPage } from "./pages/Product";
import { SupplierDetailPage, SupplierListingPage } from "./pages/Supplier";
import {
  CreateRecipeFormPage,
  EditRecipeFormPage,
  RecipeDetailPage,
  RecipesListingPage,
} from "./pages/Recipes";

const App: React.FunctionComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: true,
        retryDelay(failureCount) {
          if (failureCount > 5) {
            return 30000;
          }
          return Math.min(1000 * 2 ** failureCount, 30000);
        },
      },
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/app",
      element: <AppTemplate />,
      children: [
        {
          path: "/app/",
          element: <IndexPage />,
        },
        {
          path: "/app/users",
          children: [
            {
              path: "/app/users",
              element: <UserListingPage />,
            },
            {
              path: "/app/users/info/:userId",
              element: <UserDetailPage />,
            },
          ],
        },
        {
          path: "/app/products",
          children: [
            {
              path: "/app/products",
              element: <ProductListingPage />,
            },
            {
              path: "/app/products/info/:productId",
              element: <ProductDetailPage />,
            },
          ],
        },
        {
          path: "/app/suppliers",
          children: [
            {
              path: "/app/suppliers",
              element: <SupplierListingPage />,
            },
            {
              path: "/app/suppliers/info/:supplierId",
              element: <SupplierDetailPage />,
            },
          ],
        },
        {
          path: "/app/recipes",
          children: [
            {
              path: "/app/recipes",
              element: <RecipesListingPage />,
            },
            {
              path: "/app/recipes/create",
              element: <CreateRecipeFormPage />,
            },
            {
              path: "/app/recipes/info/:recipeId",
              element: <RecipeDetailPage />,
            },
            {
              path: "/app/recipes/edit/:recipeId",
              element: <EditRecipeFormPage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
