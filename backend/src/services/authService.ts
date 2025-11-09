import { NextFunction } from "express";
import { errorCode } from "../config";
import { findUserByPhone, updateUserById } from "../models/authModel";
import { checkUserIfNotExist } from "../utils/check";
import { createError } from "../utils/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const isMatchPassword = await bcrypt.compare(password, user!.password);
  if (!isMatchPassword) {
    const lastRequest = new Date(user!.updatedAt).toLocaleDateString();
    const isSameDay = lastRequest === new Date().toLocaleDateString();

    if (!isSameDay) {
      // Reset login attempts if it's a new day
      await updateUserById(user!.id, { errorLoginCount: 1 });
    } else {
      if (user!.errorLoginCount >= 2) {
        await updateUserById(user!.id, { status: "FREEZE" });
      } else {
        await updateUserById(user!.id, { errorLoginCount: { increment: 1 } });
      }
    }

    throw createError("Incorrect password.", 401, errorCode.unauthenticated);
  }

  const accessToken = jwt.sign(
    { id: user!.id },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: 60 * 10 } // 10 mins
  );

  const refreshToken = jwt.sign(
    { id: user!.id, phone: user!.phone },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "30d" } // 1 month
  );

  await updateUserById(user!.id, {
    errorLoginCount: 0,
    randToken: refreshToken,
  });

  return { accessToken, refreshToken, userId: user!.id };
};
