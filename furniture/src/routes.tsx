import { createBrowserRouter } from "react-router";

import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import RootLayout from "@/pages/layout/RootLayout";
import ProductPage from "@/pages/product/Product";
import Register from "@/pages/auth/Register";
import AuthRootLayout from "@/components/auth/root-layout";
import OtpPage from "@/pages/auth/Otp";
import ConfirmPasswordPage from "@/pages/auth/Password";
import ErrorPage from "./error";
import {
  confirmPasswordAction,
  loginAction,
  registerAction,
  verifyOtpAction,
} from "@/router/actions";
import {
  confirmPasswordLoader,
  homeLoader,
  verifyOtpLoader,
} from "./router/loaders";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: Home, loader: homeLoader },
      { path: "product", Component: ProductPage },
    ],
  },
  { path: "/login", Component: Login, action: loginAction },
  {
    path: "/register",
    Component: AuthRootLayout,
    children: [
      { index: true, Component: Register, action: registerAction },
      {
        path: "otp",
        Component: OtpPage,
        loader: verifyOtpLoader,
        action: verifyOtpAction,
      },
      {
        path: "password",
        Component: ConfirmPasswordPage,
        loader: confirmPasswordLoader,
        action: confirmPasswordAction,
      },
    ],
  },
]);
