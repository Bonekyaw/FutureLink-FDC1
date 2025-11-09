import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import { loginService } from "../../services/authService";

export const login = [
  body("phone", "Invalid Phone number")
    .trim()
    .notEmpty()
    .matches(/^\d+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password must be at least 8 characters long")
    .trim()
    .notEmpty()
    .matches(/^\d+$/)
    .isLength({ min: 8, max: 8 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    try {
      const { phone, password } = req.body;
      const { accessToken, refreshToken, userId } = await loginService(
        phone,
        password
      );
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 1000 * 60 * 10, // 10 mins
          path: "/",
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
          path: "/",
        })
        .status(200)
        .json({
          message: "Successfully Logged In.",
          userId,
        });
    } catch (error) {
      next(error);
    }
  },
];
