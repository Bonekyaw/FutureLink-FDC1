import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/error";
import { errorCode } from "../config";
import jwt from "jsonwebtoken";
import { findUserById, updateUserById } from "../models/userRepository";

interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const auth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return next(
      createError("You are not authenticated!", 401, errorCode.unauthenticated)
    );
  }

  const generateNewTokens = async () => {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch {
      return next(
        createError(
          "You are not authenticated!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not authenticated!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const user = await findUserById(decoded.id);
    if (!user) {
      return next(
        createError(
          "You are not authenticated!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.phone !== decoded.phone) {
      return next(
        createError(
          "You are not authenticated!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.randToken !== refreshToken) {
      return next(
        createError(
          "You are not authenticated!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const newAccessTokenPayload = { id: user.id };
    const newRefreshTokenPayload = { id: user.id, phone: user.phone };

    const newAccessToken = jwt.sign(
      newAccessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 * 10 } // 10 mins
    );

    const newRefreshToken = jwt.sign(
      newRefreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "30d" } // 1 month
    );

    await updateUserById(user.id, { randToken: newRefreshToken });

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 10 * 60 * 1000, // 10 mins
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
      });

    req.userId = user.id;
    next();
  };

  if (!accessToken) {
    generateNewTokens();
  } else {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as {
        id: number;
      };

      if (isNaN(decoded.id)) {
        return next(
          createError(
            "You are not authenticated!",
            401,
            errorCode.unauthenticated
          )
        );
      }

      req.userId = decoded.id;
      next();
    } catch (err: any) {
      if (err.name == "TokenExpiredError") {
        generateNewTokens();
      } else {
        return next(
          createError(
            "You are not authenticated!",
            401,
            errorCode.unauthenticated
          )
        );
      }
    }
  }
};
