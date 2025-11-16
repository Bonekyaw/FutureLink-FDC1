// import { User } from "../../generated/prisma";
import { errorCode } from "../config";
import { createError } from "./error";

export const checkUserIfNotExist = (user: any) => {
  if (!user) {
    const error = createError(
      "This phone number has not registerd",
      401,
      errorCode.unauthenticated
    );

    throw error;
  }
};

export const checkUserIfExist = (user: any) => {
  if (user) {
    const error = createError(
      "This phone number has already registerd",
      409,
      errorCode.userExist
    );

    throw error;
  }
};

export const checkOtpErrorIfSameDay = (
  isSameDate: boolean,
  errorCount: number
) => {
  if (isSameDate && errorCount >= 5) {
    const error = createError(
      "OTP is wrong 5 times. Please try again tomorrow.",
      401,
      errorCode.overLimit
    );

    throw error;
  }
};
