// This is for testing purposes only
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

  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  res
    .status(200)
    .json({
      message: "File uploaded successfully.",
      filePath: file.path,
      userId,
    });
};
