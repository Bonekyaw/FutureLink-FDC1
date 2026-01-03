import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import {
  confirmPasswordService,
  loginService,
  registerService,
  verifyOtpService,
} from "../../services/authService";

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

export const register = [
  body("phone", "Invalid Phone number")
    .trim()
    .notEmpty()
    .matches(/^\d+$/)
    .isLength({ min: 5, max: 12 }),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    try {
      const phone = req.body.phone;
      const { phone_number, token } = await registerService(phone);
      res.status(200).json({
        message: "We are sending OTP to 09" + phone_number,
        phone: phone_number,
        token,
      });
    } catch (error) {
      next(error);
    }
  },
];

export const verifyOtp = [
  body("phone", "Invalid Phone Number")
    .trim()
    .matches(/^\d+$/)
    .isLength({ min: 5, max: 12 }),
  body("otp", "OTP must be 6 digits long")
    .trim()
    .matches(/^\d+$/)
    .isLength({ min: 6, max: 6 }),
  body("token", "Verification token is required").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    try {
      const { phone, otp, token } = req.body;
      const verifyToken = await verifyOtpService(phone, otp, token);
      res.status(200).json({
        message: "OTP verified successfully",
        phone,
        token: verifyToken,
      });
    } catch (error) {
      next(error);
    }
  },
];

export const confirmPassword = [
  body("phone", "Invalid Phone Number")
    .trim()
    .matches(/^\d+$/)
    .isLength({ min: 5, max: 12 }),
  body("password", "Password must be 8 digits long")
    .trim()
    .matches(/^\d+$/)
    .isLength({ min: 8, max: 8 }),
  body("token", "Verification token is required").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    try {
      const { phone, password, token } = req.body;
      const { accessToken, refreshToken, userId } =
        await confirmPasswordService(phone, password, token);
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 10 * 60 * 1000,
          path: "/",
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          path: "/",
        })
        .status(200)
        .json({ message: "successfully created an account", userId });
    } catch (error) {
      next(error);
    }
  },
];
