import express from "express";
import upload from "../middleware/uploadFile";
import { profileUploadTest } from "../controllers/admin/profileController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/profile", auth, upload.single("avatar"), profileUploadTest);

export default router;
