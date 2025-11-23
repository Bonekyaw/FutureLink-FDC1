import { createBrowserRouter } from "react-router";

import App from "@/pages/App";
import Login from "@/pages/auth/Login";
import RootLayout from "@/pages/layout/RootLayout";
import Product from "@/pages/product/Product";
import Register from "@/pages/auth/Register";
import AuthRootLayout from "@/components/auth/root-layout";
import OtpPage from "@/pages/auth/Otp";
import ConfirmPasswordPage from "@/pages/auth/Password";
import ErrorPage from "./error";
import { loginAction } from "@/router/actions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: App },
      { path: "product", Component: Product },
    ],
  },
  { path: "/login", Component: Login, action: loginAction },
  {
    path: "/register",
    Component: AuthRootLayout,
    children: [
      { index: true, Component: Register },
      { path: "otp", Component: OtpPage },
      { path: "password", Component: ConfirmPasswordPage },
    ],
  },
]);
