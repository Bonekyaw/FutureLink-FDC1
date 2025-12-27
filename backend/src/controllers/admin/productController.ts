import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";

interface AuthenticatedRequest extends Request {
  userId?: number;
  files?: any;
}

export const createProduct = [
  body("name", "Name is required").trim().notEmpty().escape(),
  body("description", "Description is required").trim().notEmpty().escape(),
  body("price", "Price must be a number")
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount must be a number")
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Stock must be an integer").isInt({ gt: -1 }),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("tags", "Tags must be an array").customSanitizer((value) => {
    if (typeof value === "string") {
      return value.split(",").filter((tag) => tag.trim() !== "");
    }
    return value;
  }),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.files && req.files.length > 0) {
        // Delete uploaded files if validation fails
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
  },
];
