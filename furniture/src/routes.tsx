import { createBrowserRouter } from "react-router";

import App from "./pages/App";
import Login from "./pages/auth/Login";
import RootLayout from "./pages/layout/RootLayout";
import Product from "./pages/product/Product";
import Register from "./pages/auth/Register";
import AuthRootLayout from "@/components/auth/root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: App },
      { path: "product", Component: Product },
    ],
  },
  { path: "/login", Component: Login },
  {
    path: "/register",
    Component: AuthRootLayout,
    children: [{ index: true, Component: Register }],
  },
]);
