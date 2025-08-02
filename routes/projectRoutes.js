import express from "express";
import { teamUpload, blogUpload, serviceUpload } from "../middleware/multerMiddleware.js";

import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/", serviceUpload.single("image"), createProject);
router.get("/", getProjects);
router.put("/:id", serviceUpload.single("image"), updateProject);
router.delete("/:id", deleteProject);

export default router;
