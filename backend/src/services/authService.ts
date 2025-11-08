import { errorCode } from "../config";
import { findUserByPhone } from "../models/authModel";
import { checkUserIfNotExist } from "../utils/check";
import { createError } from "../utils/error";

export const loginService = async (phone: string, password: string) => {
  if (phone.startsWith("09")) {
    phone = phone.substring(2); // Remove leading '09'
  }
  const user = await findUserByPhone(phone);
  checkUserIfNotExist(user);

  if (user?.status === "FREEZE") {
    throw createError(
      "Your account is temporarily locked. Please contact us.",
      401,
      errorCode.unauthenticated
    );
  }
};
