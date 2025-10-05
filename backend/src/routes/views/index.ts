import express from "express";
import { home } from "../../controllers/web/homeController";

const router = express.Router();

router.get("/", home);

export default router;
