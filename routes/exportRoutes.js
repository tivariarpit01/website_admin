// routes/exportRoutes.js
import express from "express";
import {
  exportMessagesToExcel,
  exportProjectsToExcel,
} from "../controllers/exportController.js";
import { protect } from "../middleware/authMiddleware.js"; // If you're using auth

const router = express.Router();

router.get("/messages", protect, exportMessagesToExcel);
router.get("/projects", protect, exportProjectsToExcel);

export default router;
