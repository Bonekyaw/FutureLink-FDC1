import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";

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
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    try {
      const { phone, password } = req.body;
      return res.status(200).json({ message: "Login data is valid" });
    } catch (error) {
      next(error);
    }
  },
];
