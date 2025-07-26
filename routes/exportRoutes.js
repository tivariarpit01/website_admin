// routes/exportRoutes.js
import express from "express";
import { exportMessagesToExcel } from "../controllers/exportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/messages/export", protect, admin, exportMessagesToExcel);

export default router;


// server.js or index.js - ADD this import with existing routes
import exportRoutes from "./routes/exportRoutes.js";
app.use("/api", exportRoutes);