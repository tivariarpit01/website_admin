import express from "express";
import { serviceUpload } from "../middleware/cloudinaryUpload.js";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, serviceUpload.single("image"), createService);
router.put("/:id", protect, serviceUpload.single("image"), updateService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.delete("/:id", protect, deleteService);

export default router;
