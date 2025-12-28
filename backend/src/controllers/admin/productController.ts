import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../config";
import path from "path";
import { unlink } from "fs/promises";
import { findUserById } from "../../models/userRepository";
import sharp from "sharp";

interface AuthenticatedRequest extends Request {
  userId?: number;
  files?: any;
}

const removeFiles = async (originalFileNames: string[]) => {
  // Implement file removal logic here, e.g., using fs.unlink
  try {
    for (const originalFileName of originalFileNames) {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images/" + originalFileName
      );
      await unlink(originalFilePath);
      console.log(`Deleted file: ${originalFilePath}`);
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
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles);
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

    // Optimize file
    await Promise.all(
      files.map(async (file: any) => {
        // console.log("Uploaded file:", file.filename);
        const splitFileName = file.filename.split(".")[0];
        const optimizeFilePath = path.join(
          __dirname,
          "../../..",
          "/uploads/optimize/" + splitFileName + ".webp"
        );

        try {
          return await sharp(file.path)
            .resize(835, 577)
            .webp({ quality: 80 })
            .toFile(optimizeFilePath);
        } catch (error) {
          console.log(error);
        }
      })
    );

    const originalFileNames = files.map((file: any) => ({
      url: file.filename,
    }));
  },
];
