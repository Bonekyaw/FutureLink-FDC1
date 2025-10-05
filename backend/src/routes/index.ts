import express from "express";
import { healthCheck } from "../controllers/healthController";
import webRoutes from "./views";

const router = express.Router();

router.get("/health", healthCheck);
router.use(webRoutes);

export default router;
