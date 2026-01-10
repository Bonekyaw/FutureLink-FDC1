import { redirect, type ActionFunctionArgs } from "react-router";
import { authApi } from "@/api/axios";
import { AxiosError } from "axios";
import useAuthStore from "@/store/authStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  // const phone = formData.get("phone");
  // const password = formData.get("password");
  const data = Object.fromEntries(formData);

  try {
    const response = await authApi.post("/login", data);
    if (response.status !== 200) {
      return { error: response.data || "Login failed" };
    }
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: error.response.data || "Login failed" };
      }
    }
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await authApi.post("/register", data);
    authStore.setAuth(response.data.phone, response.data.token, "otp");
    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return { error: `Registration failed: ${error.response.data.message}` };
      }
    }
  }
};

export const verifyOtpAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  // const data = Object.fromEntries(formData);

  const data = {
    phone: authStore.phone,
    otp: formData.get("pin"),
    token: authStore.token,
  };

  try {
    const response = await authApi.post("/register/otp", data);
    authStore.setAuth(response.data.phone, response.data.token, "confirm");
    return redirect("/register/confirm-password");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          error: `OTP verification failed: ${error.response.data.message}`,
        };
      }
    }
  }
};

export const confirmPasswordAction = async ({
  request,
}: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState();
  const formData = await request.formData();
  // const data = Object.fromEntries(formData);

  const data = {
    phone: authStore.phone,
    password: formData.get("password"),
    token: authStore.token,
  };

  try {
    await authApi.post("/register/password", data);
    authStore.clearAuth();
    return redirect("/");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        return {
          error: `Password Confirmation failed: ${error.response.data.message}`,
        };
      }
    }
  }
};
