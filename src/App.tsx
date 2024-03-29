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
import {
  CreateStockEntryPage,
  StockEntryDetailPage,
  StockEntryListingPage,
} from "./pages/StockEntry";
import { CreateSalePage, SaleDetailPage, SaleListingPage } from "./pages/Sales";
import {
  AdjustDetailPage,
  AdjustListingPage,
  CreateAdjustPage,
} from "./pages/Adjust";

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
        {
          path: "/app/stock_entry",
          children: [
            {
              path: "/app/stock_entry",
              element: <StockEntryListingPage />,
            },
            {
              path: "/app/stock_entry/create",
              element: <CreateStockEntryPage />,
            },
            {
              path: "/app/stock_entry/info/:stockEntryId",
              element: <StockEntryDetailPage />,
            },
          ],
        },
        {
          path: "/app/adjust",
          children: [
            {
              path: "/app/adjust",
              element: <AdjustListingPage />,
            },
            {
              path: "/app/adjust/create",
              element: <CreateAdjustPage />,
            },
            {
              path: "/app/adjust/info/:adjustId",
              element: <AdjustDetailPage />,
            },
          ],
        },
        {
          path: "/app/sales",
          children: [
            {
              path: "/app/sales",
              element: <SaleListingPage />,
            },
            {
              path: "/app/sales/create",
              element: <CreateSalePage />,
            },
            {
              path: "/app/sales/info/:saleId",
              element: <SaleDetailPage />,
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
