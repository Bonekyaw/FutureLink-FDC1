import express from "express";
import upload, { uploadMemory } from "../middleware/uploadFile";
import { profileUploadTest } from "../controllers/admin/profileController";
import { auth } from "../middleware/auth";
import { createProduct } from "../controllers/admin/productController";

const router = express.Router();

// For Testing purpose
router.post("/profile", auth, uploadMemory.single("avatar"), profileUploadTest);

// For uploading a new product to database
router.post("/product/create", auth, upload.array("images", 5), createProduct);

export default router;
