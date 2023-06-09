import { ConfigProvider } from "antd";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import esES from "antd/locale/es_ES";
import {
  CreateUserFormPage,
  IndexPage,
  LoginPage,
  UserListingPage,
  Index
} from "./pages";
import AppTemplate from "./components/templates/AppTemplate";
import React from "react";

const App: React.FunctionComponent = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    // {
    //   path: "/login",
    //   element: <LoginPage />,
    // },
    // {
    //   path: "/app",
    //   element: <AppTemplate />,
    //   children: [
    //     {
    //       path: "/app/",
    //       element: <IndexPage />,
    //     },
    //     {
    //       path: "/app/users",
    //       children: [
    //         {
    //           path: "/app/users",
    //           element: <UserListingPage />,
    //         },
    //         {
    //           path: "/app/users/create",
    //           element: <CreateUserFormPage />,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ]);
  return (
    <ConfigProvider locale={esES}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
