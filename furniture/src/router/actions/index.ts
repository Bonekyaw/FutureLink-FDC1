import { redirect, type ActionFunctionArgs } from "react-router";
import { authApi } from "@/api/axios";
import { AxiosError } from "axios";

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
