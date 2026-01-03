import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import path from "path";
import { unlink } from "node:fs/promises";
import { unlink as fsUnlink } from "fs/promises";

import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import { findUserById } from "../../models/userRepository";
import { productCreateService } from "../../services/productService";

interface AuthenticatedRequest extends Request {
  userId?: number;
  files?: any;
}
// For windows Users
async function safeUnlink(
  filePath: string,
  retries = 3,
  delayMs = 100
): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await fsUnlink(filePath);
      return;
    } catch (err: any) {
      // Only retry on EPERM or EBUSY (Windows file-lock errors)
      if ((err.code === "EPERM" || err.code === "EBUSY") && attempt < retries) {
        // wait a bit, then retry
        await new Promise((res) => setTimeout(res, delayMs));
        continue;
      }
      // rethrow for any other error, or if out of retries
      throw err;
    }
  }
}

const removeFiles = async (
  originalFileNames: string[],
  optimizedFiles: string[] | null
) => {
  // Implement file removal logic here, e.g., using fs.unlink
  try {
    for (const originalFileName of originalFileNames) {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images/" + originalFileName
      );
      await unlink(originalFilePath);
      // await safeUnlink(originalFilePath);
      // console.log(`Deleted file: ${originalFilePath}`);
    }

    if (optimizedFiles) {
      for (const optimizedFile of optimizedFiles) {
        const optimizedFilePath = path.join(
          __dirname,
          "../../..",
          "/uploads/optimize",
          optimizedFile
        );
        // await safeUnlink(optimizedFilePath);  // Use this For windows error - 'EPERM' or 'EBUSY'
        await unlink(optimizedFilePath);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const createProduct = [
  body("name", "Name is required").trim().notEmpty().escape(),
  body("description", "Description is required").trim().notEmpty().escape(),
  body("price", "Price must be a number")
    .isFloat({ gt: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount must be a number")
    .isFloat({ min: 0 })
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
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    if (req.files && req.files.length === 0) {
      return next(
        createError("At least one image is required", 400, errorCode.invalid)
      );
    }

    // Authorisation check
    const userId = req.userId;
    const user = await findUserById(userId!);
    if (user?.role !== "ADMIN") {
      if (req.files && req.files.length > 0) {
        // Delete uploaded files if validation fails
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }

      return next(
        createError("This action is not allowed", 403, errorCode.unauthorised)
      );
    }

    const {
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;
    const files = req.files;

    const productId = await productCreateService({
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
      files,
    });

    res.status(201).json({
      message: "Successfully created a new product.",
      productId,
    });
  },
];
