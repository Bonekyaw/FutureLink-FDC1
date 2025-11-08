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
