import express from "express";
import { healthCheck } from "../controllers/healthController";
import webRoutes from "./views";
import apiRoutes from "./apiRoutes";

const router = express.Router();

router.get("/health", healthCheck);
router.use(webRoutes);
router.use("/api/v1", apiRoutes); // http://localhost:4000/api/v1/...

export default router;
