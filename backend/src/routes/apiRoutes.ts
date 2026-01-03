import express from "express";
import {
  confirmPassword,
  login,
  register,
  verifyOtp,
} from "../controllers/api/authController";
import { auth } from "../middleware/auth";
import {
  getCategoryType,
  getProductsByPagination,
} from "../controllers/api/productController";

const router = express.Router();

router.post("/login", login); // http://localhost:4000/api/v1/login

router.post("/register", register);
router.post("/register/otp", verifyOtp);
router.post("/register/password", confirmPassword);

router.get("/products", auth, getProductsByPagination); // Cursor-based Pagination
router.get("/filter-type", auth, getCategoryType);

export default router;
