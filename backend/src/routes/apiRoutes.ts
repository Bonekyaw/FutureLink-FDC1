import express from "express";
import { login, register } from "../controllers/api/authController";

const router = express.Router();

router.post("/login", login); // http://localhost:4000/api/v1/login

router.post("/register", register);
router.post("/register/otp", () => {});
router.post("/register/password", () => {});

export default router;
