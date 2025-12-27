// This is for testing purposes only
import sharp from "sharp";
import path from "path";

import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const profileUploadTest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const file = req.file;
  // console.log("File Upload", file);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const splitFileName = file.originalname.split(".")[0];

  const optimizeFilePath = path.join(
    __dirname,
    "../../..",
    "/uploads/images/optimized-" + splitFileName + ".webp"
  );

  try {
    await sharp(req.file?.buffer)
      .resize(200, 200)
      .webp({ quality: 50 })
      .toFile(optimizeFilePath);
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    message: "File uploaded successfully.",
    // filePath: file.path,
    userId,
  });
};
