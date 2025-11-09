import express from "express";
import { login } from "../controllers/api/authController";

const router = express.Router();

router.post("/login", login); // http://localhost:4000/api/v1/login

export default router;
