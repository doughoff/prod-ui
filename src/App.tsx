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
import { initializeApi } from "./api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
      ],
    },
  ]);
  React.useEffect(() => {
    initializeApi();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
