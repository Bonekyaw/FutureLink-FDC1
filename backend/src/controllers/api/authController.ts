import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

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
      return res.status(400).json({ errors });
    }

    return res.status(200).json({ message: "Login data is valid" });
  },
];
